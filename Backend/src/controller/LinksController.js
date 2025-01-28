import { nanoid } from 'nanoid';
import Link from '../models/LinkSchema.js';
import Click from '../models/ClickSchema.js';
import mongoose from 'mongoose';
import moment from 'moment';
import {UAParser} from 'ua-parser-js';
import dotenv from 'dotenv';

dotenv.config({
    path:'./.env'
});

// Create a new short link
export const createLink = async (req, res) => {
  try {
    const { originalUrl, remarks, expiresAt } = req.body;
    const shortCode = nanoid(8);

    const link = new Link({
      originalUrl,
      shortCode,
      remarks,
      expiresAt: expiresAt || null,
      userId: req.userId
    });

    await link.save();
    res.status(201).json(link);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all links for a user
export const getLinks = async (req, res) => {
  const { page = 1, limit = 8 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const links = await Link.find({ userId: req.userId })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalLinks = await Link.countDocuments({ userId: req.userId });

    res.json({
      links,
      currentPage: page,
      totalPages: Math.ceil(totalLinks / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get a single link
export const getLink = async (req, res) => {
  try {
    const link = await Link.findOne({ _id: req.params.id, userId: req.userId });
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }
    res.json(link);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get links by remarks

export const getLinksByRemarks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 8; 
    const skip = (page - 1) * limit;

    if (!req.params.remarks) {
      return res.status(400).json({ error: "Remarks parameter is required." });
    }

    const links = await Link.find({
      remarks: { $regex: req.params.remarks, $options: "i" }, 
      userId: req.userId,
    })
      .skip(skip)
      .limit(limit);

    if (links.length === 0) {
      return res.status(404).json({ message: "No links found for the given remarks." });
    }

    res.json({ links, currentPage: page, totalLinks: links.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// Update link status (active/inactive)
export const updateLinkStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const link = await Link.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { isActive },
      { new: true }
    );
    res.json(link);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Edit a link
export const editLink = async (req, res) => {
  try {
    const { originalUrl, remarks, expiresAt } = req.body;
    const link = await 
    Link.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { originalUrl, remarks, expiresAt },
      { new: true }
    );
    res.json(link);
    }
    catch (error) {
    res.status(500).json({ error: error.message });
    }
}

// Delete a link
export const deleteLink = async (req, res) => {
  try {
    await Link.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Redirect and track clicks
export const redirectAndTrackClicks = async (req, res) => {
  try {
    const link = await Link.findOne({ shortCode: req.params.shortCode });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    // Check if the link is active or expired
    if (!link.isActive || (link.expiresAt && new Date() > link.expiresAt)) {
      return res.status(410).json({ error: 'Link is inactive or expired' });
    }

    // Parse the user-agent to determine device type
    const parser = new UAParser(req.headers['user-agent']);
    const result = parser.getResult();
    let device = 'Desktop';

    if (result.device.type === 'mobile') device = 'Mobile';
    else if (result.device.type === 'tablet') device = 'Tablet';

    // Extract the user ID if available
    const userId = req.userId;

    // Track the click
    const click = new Click({
      linkId: link._id,
      ipAddress: req.headers['x-forwarded-for']?.split(',')[0] || req.ip,
      userAgent: req.headers['user-agent'],
      device,
      userId,
    });
    await click.save();

    // Increment the click count for the link
    await Link.findByIdAndUpdate(link._id, { $inc: { clicks: 1 } });

    // Send the original URL in the response
    res.json({ url: link.originalUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get analytics for a specific link
export const getLinkAnalytics = async (req, res) => {
  try {
    const link = await Link.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    
    const clicksByDate = await Click.aggregate([
      { $match: { linkId: link._id } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": -1 } }
    ]);

   
    const clicksByDevice = await Click.aggregate([
      { $match: { linkId: link._id } },
      {
        $group: {
          _id: "$device",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalClicks: link.clicks,
      clicksByDate,
      clicksByDevice
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.userId; 

    const totalClicks = await Click.countDocuments({ userId });

    const dateWiseClicks = await Click.aggregate([
      {
        $match: { userId} 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          clicks: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    const deviceClicks = await Click.aggregate([
      {
        $match: { userId } // Filter by userId
      },
      {
        $group: {
          _id: "$device",
          clicks: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalClicks,
      dateWiseClicks,
      deviceClicks
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const getClickAnalytics = async (req, res) => {
  try {
    const userId = req.userId; 
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const clicks = await Click.aggregate([
      {
        $match: { userId } // Filter clicks by userId
      },
      {
        $lookup: {
          from: 'links',
          localField: 'linkId',
          foreignField: '_id',
          as: 'linkDetails'
        }
      },
      {
        $unwind: '$linkDetails'
      },
      {
        $project: {
          timestamp: 1,
          originalUrl: '$linkDetails.originalUrl',
          shortCode: '$linkDetails.shortCode',
          ipAddress: 1,
          device: 1
        }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]);

    const totalClicks = await Click.countDocuments({ userId });

    if (clicks.length === 0) {
      return res.status(404).json({ message: 'No click data found.' });
    }

    res.json({
      clicks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalClicks / limit),
        totalClicks: totalClicks
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};