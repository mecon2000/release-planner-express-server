const initialDb = {
  groups: {
    data: ['Core', 'Web', 'Scanner'],
    enableEditing: false
  },
  teams: {
    data:
      [
        { name: 'Spiders', group: 'Web' },
        { name: 'Sharks', group: 'Web' },
        { name: 'Threads', group: 'Web' },
        { name: 'Team13', group: 'Scanner' },
        { name: 'Seals', group: 'Scanner' },
      ],
    enableEditing: true
  },
  devs: {
    data:
      [
        { name: 'Shay', team: 'Spiders',capacity: {w1:5,w2:4,w3:2} },
        { name: 'Guy', team: 'Spiders', capacity: {w1:1,w2:2,w3:3} },
        { name: 'Lior', team: 'Spiders', capacity: {w1:0,w2:0,w5:0} },
        { name: 'Jenny', team: 'Sharks', capacity: {w1:2,w2:2,w3:2,w4:2} },
        { name: 'Shanny', team: 'Sharks', capacity: {w1:1,w2:1,w3:1} },
      ],
    enableEditing: true
  }
};

module.exports = initialDb;