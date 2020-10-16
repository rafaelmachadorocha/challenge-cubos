const Schedule = require('../models/Schedule');
const ScheduleHelper = require('../helpers/scheduleHelper');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Get schedule rules => /api/v1/schedules
exports.getSchedules = async (req, res, next) => {

  const availableSchedules = await Schedule.find();
  res.status(200).json({
    success: true,
    results: availableSchedules.length,
    schedules: availableSchedules
  });
}

//Search for avaiable schedules within range => /api/v1/schedules/:begin/:end
exports.getScheduleWithinRange = async (req, res, next) => {
  const { begin, end } = req.params
  const scheduleRules = Schedule.find(begin, end)
  scheduleRules.then((value) => {
    const schedules = ScheduleHelper.filterAvailableSchedules(value);
    res.status(200).json({
      success: true,
      results: schedules.length,
      "available-schedules": schedules
    });
  }).catch((reason) => {
    res.status(200).json({
      sucess: false,
      results: reason.length,
      "available-schedules": reason
    })
  })
  
 
}

//Create a schedule rule => /api/v1/schedules/new
exports.newSchedule = async (req, res, next) => {
 const response = await Schedule.create(req.body);
 if(typeof(response) === 'object') {
  res.status(200).json({
    success: true,
    message: 'Schedule added',
    schedule: response
  });
 } else res.status(500).json({
   sucess: false,
   message: response
 })
  
};

//Delete an specific schedule rule => api/v1/job/:id
exports.deleteSchedule = async (req, res, next) => {
  let schedule = Schedule.findByIdAndDelete(req.params.id)
  schedule.then((value) => res.status(200).json({
    success: true,
    message: 'Schedule is deleted',
    removedSchedule: value
  })).catch((reason) => res.status(404).json({
    sucess: false,
    message: reason
  }))
}

