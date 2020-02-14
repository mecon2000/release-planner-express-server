const dbService = require('./services/db/dbService');
const planCalculator = require('./planCalculator');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

app.listen(3333, () => {
  console.log('Server running on port 3333');
});

app.get('/groups', async (req, res, next) => {
  try {
    const groups = await dbService.getGroups();
    res.json(groups);
  } catch (e) {
    console.log('/groups failed! because: ', e);
    res.json({}); //TODO convert to error in all get functions
  }
});

app.get('/teams', async (req, res, next) => {
  try {
    const devDetails = await dbService.getDevsWithDetails();
    res.json(devDetails.map(dev => ({ name: dev.name, group: dev.group })));
  } catch (e) {
    console.log('/teams failed! because: ', e);
    res.json({});
  }
});

app.get('/teams/withDevs', async (req, res, next) => {
  try {
    const devDetails = await dbService.getDevsWithDetails();
    res.json(devDetails);
  } catch (e) {
    console.log('/teams/withDevs failed! because: ', e);
    res.json({});
  }
});

app.get('/releases', async (req, res, next) => {
  try {
    const releases = await dbService.getReleases();
    res.json(releases);
  } catch (e) {
    console.log('/releases failed! because: ', e);
    res.json({});
  }
});

app.get('/devs', async (req, res, next) => {
  try {
    const devsCapacity = await dbService.getDevsCapacity();
    res.json(devsCapacity);
  } catch (e) {
    console.log('/devs failed! because: ', e);
    res.json({});
  }
});

app.get('/devs&team=:team', async (req, res, next) => {
  try {
    const devsCapacity = await dbService.getDevsCapacity();
    const devsOnSpecificTeam = devsCapacity.filter(dev => dev.team.toLowerCase() === req.params['team'].toLowerCase());
    res.json(devsOnSpecificTeam);
  } catch (e) {
    console.log('/devs failed! because: ', e);
    res.json({});
  }
});

app.get('/weekDates', async (req, res, next) => {
  //TODO this should be calculated, depending on the earliest release, and the latest.
  // returned value should look like {startingDate: '1/1/2020', weekNumber:1}.
  //client should expect that object, instead of currently array of w?.
  res.json(['w5', 'w6', 'w7', 'w8', 'w9', 'w10', 'w11', 'w12']);
});

app.get('/epics', async (req, res, next) => {
  try {
    const epics = await dbService.getEpics();
    res.json(epics);
  } catch (e) {
    console.log('/epics failed! because: ', e);
    res.json({});
  }
});

const isTeamExists = async teamName => {
  const devDetails = await dbService.getDevsWithDetails();
  return devDetails.some(team => team.name.toLowerCase() === teamName.toLowerCase());
};

app.get('/plans&team=:team', async (req, res, next) => {
  try {
    const teamName = req.params['team'].toLowerCase();
    if (await !isTeamExists(teamName)) {
      throw `team does not exist! ${teamName}`;
    }
    const plans = await dbService.getPlans(teamName);
    res.json(plans);
  } catch (e) {
    console.log('/plans failed! because: ', e);
    res.json({});
  }
});

app.get('/plans', async (req, res, next) => {
  try {
    const plans = await dbService.getPlans();
    res.json(plans);
  } catch (e) {
    console.log('/plans failed! because: ', e);
    res.json({});
  }
});

//TODO should be post, don't return new plan. insteda, make client listen to changes from server (push notifications?)
app.get('/plans/recalculate&team=:team', async (req, res, next) => {
  try {
    const teamName = req.params['team'].toLowerCase();
    if (await !isTeamExists(teamName)) {
      throw `team does not exist! ${teamName}`;
    }
    const newPlans = await planCalculator.calculatePlan(teamName);
    res.json(newPlans);
  } catch (e) {
    console.log('/plans/recalculate failed! because: ', e);
    res.json({});
  }
});


