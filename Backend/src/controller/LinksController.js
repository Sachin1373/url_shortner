import { nanoid } from 'nanoid';
import Link from '../models/LinkSchema.js';
import Click from '../models/ClickSchema.js';
import mongoose from 'mongoose';
import moment from 'moment';
import { Types } from 'mongoose';
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

    // Parse the user-agent to determine browser, operating system, and device type
    const parser = new UAParser(req.headers['user-agent']);
    const result = parser.getResult();

    let device = 'Desktop';
    if (result.device.type === 'mobile') device = 'Mobile';
    else if (result.device.type === 'tablet') device = 'Tablet';

    
    const browser = result.browser.name || 'Unknown Browser';
    const os = result.os.name || 'Unknown OS';
  

    // Track the click with parsed details
    const click = new Click({
      linkId: link._id,
      ipAddress: req.headers['x-forwarded-for']?.split(',')[0] || req.ip,
      userAgent: req.headers['user-agent'],
      os,
      device,
    
    });

    await click.save();

    // Increment the click count for the link
    await Link.findByIdAndUpdate(link._id, { $inc: { clicks: 1 } });

    // Redirect the user to the original URL
    res.json({ url: link.originalUrl });
  } catch (error) {
    console.error('Error redirecting and tracking clicks:', error.message);
    res.status(500).json({ error: error.message });
  }
};




export const getClickAnalytics = async (req, res) => {
  try {
    const userId = req.userId;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, error: "Invalid user ID" });
    }

    // Fetch all the linkIds associated with the user
    const links = await Link.find({ userId: userId }).select('_id'); // Assuming Link model has a userId field

    if (links.length === 0) {
      return res.status(404).json({ success: false, error: "No links found for the user" });
    }

    // Get the list of linkIds
    const linkIds = links.map(link => link._id);

    // Debugging Logs
    console.log("Fetching analytics for user ID:", userId);
    console.log("Link IDs associated with the user:", linkIds);

    // Get total clicks across all the links
    const totalClicks = await Click.countDocuments({ linkId: { $in: linkIds } });
    console.log("Total Clicks:", totalClicks);

    if (totalClicks === 0) {
      return res.json({
        success: true,
        data: {
          totalClicks: 0,
          dateWiseClicks: [],
          deviceWiseClicks: [],
        },
      });
    }

    // Get date-wise clicks
    const dateWiseClicks = await Click.aggregate([
      { $match: { linkId: { $in: linkIds } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 7 },
    ]);
    console.log("Date-wise Clicks:", dateWiseClicks);

    // Get device-wise clicks
    const deviceWiseClicks = await Click.aggregate([
      { $match: { linkId: { $in: linkIds } } },
      {
        $group: {
          _id: "$device",
          count: { $sum: 1 },
        },
      },
    ]);
    console.log("Device-wise Clicks:", deviceWiseClicks);

    // Return success response
    res.json({
      success: true,
      data: {
        totalClicks,
        dateWiseClicks: dateWiseClicks.map((item) => ({
          date: item._id,
          clicks: item.count,
        })),
        deviceWiseClicks: deviceWiseClicks.map((item) => ({
          device: item._id,
          clicks: item.count,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error); // Log full error
    res.status(500).json({
      success: false,
      error: error.message || "Error fetching click analytics",
    });
  }
};

// Get link clicks

export const getLinkClicks = async (req, res) => {
  try {
    
    const { page = 1, limit = 8 } = req.query; 

    const link = await Link.findOne({ userId: req.userId });

    if (!link) {
      return res.status(404).json({ error: 'Link not found for the given userId' });
    }

    
    const clicks = await Click.find({ linkId: link._id })
      .skip((page - 1) * limit) 
      .limit(parseInt(limit))  
      .sort({ timestamp: -1 }); 

    const totalClicks = await Click.countDocuments({ linkId: link._id }); 

    const totalPages = Math.ceil(totalClicks / limit); 

    if (clicks.length === 0) {
      return res.status(404).json({ message: 'No clicks found for this link' });
    }

    
    const clickData = clicks.map(click => ({
      ipAddress: click.ipAddress,
      userAgent: click.os,
      timestamp: click.timestamp, // Including timestamp in response
      device: click.device // Adding device info
    }));

    // Respond with the paginated results
    res.json({
      originalUrl: link.originalUrl,
      shortCode: link.shortCode,
      clicks: clickData,
      pagination: {
        totalPages: totalPages,
        currentPage: page,
        totalClicks: totalClicks
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};