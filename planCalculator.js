const dbService = require('./services/db/dbService');

//TODO: this file is unreadable, fix!!

const getCapacityfor1Dev = (allDevsCapacities, devName, week) => {
  const dev = allDevsCapacities.find(devData => devData.name.toLowerCase() === devName.toLowerCase());
  const capacityInSpecificWeek = dev.capacity[week];
  return capacityInSpecificWeek;
};

const getDevsWithRelevantSkill = (nextFreeWeekForEachDev, teamName, skill, parallel) => {
  //TODO implement the use of parallel here. for now assuming it's always 1
  const devsWithRelevantSkillSets = nextFreeWeekForEachDev.filter(dev => dev.name.includes(skill));
  if (devsWithRelevantSkillSets.length === 0) return [];

  const sortedDevsByNextFreeWeek = devsWithRelevantSkillSets.sort(
    (dev1, dev2) => dev2.nextFreeWeek - dev1.nextFreeWeek
  );
  const leastOccupiedDev = sortedDevsByNextFreeWeek[0];
  return [leastOccupiedDev.name];
};

const addEffortToDevs = (newPlanFor1Team, nextFreeWeekForEachDev, devs, epicName, skillEffort) => {
  let remainingEffort = skillEffort;
  let dev = nextFreeWeekForEachDev.find(dev => devs.includes(dev.name));
  if (!dev) return;

  //newPlanFor1Team should look like: {'shay-FE': {w5:epicName,w6:epicName..}], 'Lior-BE': [...] }
  let currentWeek = dev.nextFreeWeek;
  while (remainingEffort > 0) {
    if (!newPlanFor1Team[dev.name]) newPlanFor1Team[dev.name] = {};
    newPlanFor1Team[dev.name][currentWeek] = epicName;
    remainingEffort -= getCapacityfor1Dev(nextFreeWeekForEachDev, dev.name, currentWeek);
    currentWeek = increaseWeekNumber(currentWeek);
  }
  dev.nextFreeWeek = currentWeek;
};

const add1SkillIn1EpicToCorrectDev = (
  newPlanFor1Team,
  nextFreeWeekForEachDev,
  teamName,
  epicName,
  skill,
  skillEffort,
  parallel
) => {
  const devs = getDevsWithRelevantSkill(nextFreeWeekForEachDev, teamName, skill, parallel);

  if (devs.length) addEffortToDevs(newPlanFor1Team, nextFreeWeekForEachDev, devs, epicName, skillEffort);
};

const priorityComparer = (epic1, epic2) => epic1.priority - epic2.priority;

//TODO, capacity looks like {w05:5, w06:3,...etc}. return the lowest week (which isn't 0)
const getEarliestCapacityForDev = capacity => {
  return 'w05';
};

const teamIsACandidateForThisEpic = (epic, teamName) => {
  const candidates = epic.candidate_teams.map(c => c.toLowerCase());
  return candidates.includes(teamName);
};

const increaseWeekNumber = week => {
  let weekAsNumber = week.slice(1);
  weekAsNumber++;
  return 'w' + ('0' + weekAsNumber).slice(-2);
};

//TODO: implement!!
const getStartingWeek = () => 'w05';
const getEndingWeek = () => 'w12';

const transformPlan = (newPlanFor1Team, devs) => {
  //newPlanFor1Team should look like: {'shay-FE': {w5:epicName,w6:epicName..}], 'Lior-BE': [...] }
  let currentWeek = getStartingWeek();
  const endingWeek = getEndingWeek();

  let result = [];
  while (currentWeek < endingWeek) {
    const weekObj = { week: currentWeek, epics: [] };
    devs.forEach(dev => {
      const epicName = newPlanFor1Team[dev][currentWeek];
      if (epicName) weekObj.epics.push({ dev, epicName });
    });
    result.push(weekObj);
    currentWeek = increaseWeekNumber(currentWeek);
  }

  //we should return: [{week, epics[{dev1,epicname},{dev2,epicname}..]}, {}, {} ...]
  return result;
};

///////////////  Main function below  ///////////////////////////////////////////////////////////////////////////

const calculatePlan = async teamName => {
  const epics = await dbService.getEpics();
  const sortedEpicsWithNames = epics
    .sort(priorityComparer)
    .filter(epic => teamIsACandidateForThisEpic(epic, teamName))
    .map(epic => ({ name: epic.name, estimations: epic.estimations }));

  //now each epic should look like this:  {name:'name', estimations:{FE: {est:'5',max_parallel:'1'},....}}
  const devsCapacity = await dbService.getDevsCapacity();
  let nextFreeWeekForEachDev = devsCapacity
    .filter(devData => devData.team.toLowerCase() === teamName.toLowerCase())
    .map(devData => {
      return {
        name: devData.name,
        nextFreeWeek: getEarliestCapacityForDev(devData.capacity),
        capacity: devData.capacity
      };
    });

  //nextFreeWeekForEachDev looks like [{devName,nextFreeWeek, Capacity[]}]
  //sortedEpicsWithNames looks like [{epicName, est:[{BE..},{FE..}...]}]

  //newPlanFor1Team should look like: {'shay-FE': {w5:epicName,w6:epicName..}], 'Lior-BE': [...] }
  let newPlanFor1Team = {};

  sortedEpicsWithNames.forEach(epic => {
    for (const skillName of Object.keys(epic.estimations)) {
      add1SkillIn1EpicToCorrectDev(
        newPlanFor1Team,
        nextFreeWeekForEachDev,
        teamName,
        epic.name,
        skillName,
        epic.estimations[skillName].est,
        epic.estimations[skillName].max_parallel
      );
    }
  });

  //we should return: [{week, epics[{dev1,epicname},{dev2,epicname}..]}, {}, {} ...]
  const devs = nextFreeWeekForEachDev.map(devData => devData.name);
  resultedPlansByWeeks = transformPlan(newPlanFor1Team, devs);
  return resultedPlansByWeeks;
};

module.exports = {
  calculatePlan
};
