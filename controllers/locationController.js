const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../models/usermodel");
const mongoose = require("mongoose");
const nigeriaLocations = require("nigeria-geo");

const Cache = require("../config/redisConfig");

function getRegions(req, res, next) {
  try {
    const regions = new Set();
    nigeriaLocations.all().forEach((state) => {
      regions.add(state.geo_politcal_zone);
    });

    return res.status(200).json({
      status: "success",
      message: "list of regions",
      data: {
        size: regions.size,
        result: [...regions],
      },
    });
  } catch (error) {
    return next(error);
  }
}

function getStates(req, res, next) {
  try {
    const states = nigeriaLocations.states();
    return res.status(200).json({
      success: true,
      message: "List of States",
      data: {
        size: states.length,
        result: states,
      },
    });
  } catch (error) {
    return next(error);
  }
}

function getLocalGovernmentArea(req, res, next) {
  try {
    const LGAs = new Set(nigeriaLocations.all().flatMap((state) => state.lgas));

    return res.status(200).json({
      success: true,
      message: "List of Local Government Areas (LGAs)",
      data: {
        size: LGAs.size,
        result: [...LGAs],
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function getNewAPIKey(req, res, next) {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({
        status: "error",
        message: "unauthorized",
      });
    }
    const newAPIKey = await bcrypt.hash(user.username, 10);
    await UserModel.findByIdAndUpdate(user.id, { APIKey: newAPIKey });
    return res.status(201).json({
      status: "success",
      message: "New Key Generated!",
      data: {
        APIKey: newAPIKey,
        Note: `Copy your key and save it. We won't show it to you again`,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function search(req, res, next) {
  const searchCategories = ["region", "state", "lga"];
  const category = req.query.category;
  const query = req.query.query || "";

  try {
    if (!searchCategories.includes(category)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid Search Category",
      });
    }

    const filteredData = [];
    const states = nigeriaLocations.all();

    for (const state of states) {
      if (category === "region") {
        filteredData.push({
          region: state.geo_politcal_zone,
          metadata: state,
        });
      } else if (category === "state") {
        filteredData.push({
          state: state.state,
          lgas: state.lgas,
          metadata: state,
        });
      } else if (category === "lga") {
        for (const lga of state.lgas) {
          filteredData.push({
            state: state.state,
            lga,
            metadata: state,
          });
        }
      }
    }

    const lowercaseQuery = query.toLowerCase();
    const data = filteredData.filter(
      (item) =>
        item.region?.toLowerCase().includes(lowercaseQuery) ||
        item.state?.toLowerCase().includes(lowercaseQuery) ||
        item.lga?.toLowerCase().includes(lowercaseQuery)
    );

    const cacheData = {
      category,
      query,
      data: {
        size: data.length,
        result: data,
      },
    };

    if (data.length > 0) {
      await redisClient.set(`${category}-${query}`, JSON.stringify(cacheData), {
        EX: 86400,
        NX: true,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Search results",
      data: cacheData.data,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getNewAPIKey,
  getRegions,
  getStates,
  getLocalGovernmentArea,
  search,
};