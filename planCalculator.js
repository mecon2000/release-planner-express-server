const dbService = require('./services/db/dbService');

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

const addEffortToDevs = (tablesWithEfforts, devs, epicName, skillEffort) => {
  let remainingEffort = skillEffort;
  let dev = tablesWithEfforts.find(dev => devs.includes(dev.name));
  if (!dev) return;

  let currentWeek = dev.nextFreeWeek.slice(1);
  while (remainingEffort > 0) {
    dev['w' + currentWeek] = epicName;
    remainingEffort -= getCapacityfor1Dev(tablesWithEfforts, dev.name, currentWeek);
    currentWeek++;
  }
  dev.nextFreeWeek = 'w' + currentWeek;
};

const add1SkillIn1EpicToCorrectDev = (nextFreeWeekForEachDev, teamName, epicName, skill, skillEffort, parallel) => {
  const devs = getDevsWithRelevantSkill(nextFreeWeekForEachDev, teamName, skill, parallel);

  if (devs.length) {
    addEffortToDevs(nextFreeWeekForEachDev, devs, epicName, skillEffort);
  }
};

const priorityComparer = (epic1, epic2) => epic1.priority - epic2.priority;

//TODO, capacity looks like {w5:5, w6:3,...etc}. return the lowest week (which isn't 0)
const getEarliestCapacityForDev = capacity => {
  return 'w5';
};

///////////////  Main function below  ///////////////////////////////////////////////////////////////////////////

const calculatePlan = async teamName => {
  const epics = await dbService.getEpics();
  const sortedEpicsWithNames = epics
    .sort(priorityComparer)
    .filter(epic => epic.candidate_teams.includes(teamName))
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

  sortedEpicsWithNames.forEach(epic => {
    for (const skillName of Object.keys(epic.estimations)) {
      add1SkillIn1EpicToCorrectDev(
        nextFreeWeekForEachDev,
        teamName,
        epic.name,
        skillName,
        epic.estimations[skillName].est,
        epic.estimations[skillName].max_parallel
      );
    }
  });
  return nextFreeWeekForEachDev;
};

module.exports = {
  calculatePlan
};
