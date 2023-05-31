import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import Campaign from "../models/campaign.model.js";

export const reset = async (_, res) => {
  try {
    console.log("[INFO ] resetting database");
    await mongoose.connection.db.dropDatabase();

    console.log("[INFO ] initializing collections");
    
    let userCharacters = [
      // 0
      [],
      // 1  
      [
        { name: "Nagda", className: "Fighter", race: "Half-Ork", level: 2, hitPoints: 12 },
        { name: "Gnovap", className: "Bard", race: "Gnome", level: 13, hitPoints: 67 },
      ],
      // 2
      [
        { name: "Doufruth Brownshoulder", className: "Cleric", race: "Dwarf", level: 13, hitPoints: 81 },
        { name: "Theodmer Miadithas", className: "Druid", race: "Elf", level: 17, hitPoints: 103 },
        { name: "Bibbriem", className: "Paladin", race: "Gnome", level: 1, hitPoints: 10 },
      ],
      // 3
      [
        { name: "Rilkuket", className: "Bard", race: "Gnome", level: 6, hitPoints: 43 },
      ],
      // 4
      [
        { name: "Adin Shask", className: "Fighter", race: "Human", level: 7, hitPoints: 72 },
        { name: "Brer Charguz", className: "Cleric", race: "Human", level: 2, hitPoints: 10 },
      ],
      // 5
      [],
      // 6
      [
        { name: "Sotrat", className: "Barbarian", race: "Half-Ork", level: 11, hitPoints: 112 },
        { name: "Nungramli Bristlemaster", className: "Cleric", race: "Dwarf", level: 6, hitPoints: 54 },
        { name: "Ailred Umeren", className: "Ranger", race: "Elf", level: 4, hitPoints: 26 },
      ],
      // 7
      [
        { name: "Wilirwai", className: "Bard", race: "Gnome", level: 7, hitPoints: 50 },
        { name: "Norasdroth Brickbraids", className: "Wizard", race: "Dwarf", level: 13, hitPoints: 51 },
      ],
      // 8
      [
        { name: "Lulgeagit Chaosshaper", className: "Cleric", race: "Dwarf", level: 1, hitPoints: 11 },
        { name: "Taeral Helegwyn", className: "Ranger", race: "Elf", level: 6, hitPoints: 61 },
      ],
      // 9
      [],
      // 10
      [],
      // 11
      [
        { name: "Fush", className: "Barbarian", race: "Half-Ork", level: 6, hitPoints: 68 },
      ],
      // 12
      [
        { name: "Halanaestra Fenroris", className: "Wizard", race: "Elf", level: 17, hitPoints: 87 },
      ],
      // 13
      [
        { name: "Barilmotelyn Amberbuster", className: "Cleric", race: "Dwarf", level: 11, hitPoints: 100 },
        { name: "Gesvadok Hinonirke", className: "Rogue", race: "Human", level: 1, hitPoints: 9 },
        { name: "Werakuinelyn Broadfury", className: "Ranger", race: "Dwarf", level: 13, hitPoints: 93 },
      ],
      // 14
      [
        { name: "Sana Leoydark", className: "Druid", race: "Elf", level: 6, hitPoints: 47 },
      ],
      // 15
      [
        { name: "Fondotum Silverstone", className: "Fighter", race: "Dwarf", level: 17, hitPoints: 123 },
        { name: "Musaimri", className: "Fighter", race: "Half-Ork", level: 4, hitPoints: 32 },
      ],
      // 16
      [
        { name: "Shuih Ain", className: "Sorcerer", race: "Human", level: 1, hitPoints: 8 },
      ],
      // 17
      [
        { name: "Dumarte Sinadra", className: "Wizard", race: "Human", level: 1, hitPoints: 7 },
      ],
      // 18
      [
        { name: "Sherwados", className: "Rogue", race: "Gnome", level: 4, hitPoints: 22 },
        { name: "Cefnanoy Fourvalor", className: "Wizard", race: "Human", level: 11, hitPoints: 80 },
      ],
      // 19
      [
        { name: "Nemmis Habamza", className: "Rogue", race: "Human", level: 2, hitPoints: 10 },
        { name: "Thillbeth", className: "Bard", race: "Gnome", level: 4, hitPoints: 20 },
        { name: "Siwaih Burningglow", className: "Rogue", race: "Human", level: 13, hitPoints: 75 },
        { name: "Muudarall", className: "Barbarian", race: "Half-Ork", level: 1, hitPoints: 12 },
      ],
      // 20
      [
        { name: "Nopro", className: "Wizard", race: "Gnome", level: 2, hitPoints: 8 },
      ],
    ];

    let users = [
      { name: "Admin", login: "root", password: "root", isAdmin: true },
      { name: "Alistair Harvey", login: "alistair", password: "harvey" },
      { name: "Luca Hayes", login: "luca", password: "hayes" },
      { name: "Haider Holland", login: "haider", password: "holland" },
      { name: "Adam Bradley", login: "adam", password: "bradley" },
      { name: "Rufus Byrne", login: "rufus", password: "byrne" },
      { name: "Grayson Barnes", login: "grayson", password: "barnes" },
      { name: "Casey Barker", login: "casey", password: "barker" },
      { name: "Erik Doyle", login: "erik", password: "doyle" },
      { name: "Leonardo Sutton", login: "leonardo", password: "sutton" },
      { name: "Rowan Mcdonald", login: "rowan", password: "mcdonald" },
      { name: "Beatrice Roberts", login: "beatrice", password: "roberts" },
      { name: "Adriana Young", login: "adriana", password: "young" },
      { name: "Nell Walsh", login: "nell", password: "walsh" },
      { name: "Amina Ryan", login: "amina", password: "ryan" },
      { name: "Lyra Gallagher", login: "lyra", password: "gallagher" },
      { name: "Aurora Hopkins", login: "aurora", password: "hopkins" },
      { name: "Chloe Allen", login: "chloe", password: "allen" },
      { name: "Maisy Kelly", login: "maisy", password: "kelly" },
      { name: "Harley Bennett", login: "harley", password: "bennett" },
      { name: "Isabelle Gallagher", login: "isabelle", password: "gallagher" },
    ];
    for await (let { user, idx } of users.map((user, idx) => { return { user, idx } })) {
      user._id = new mongoose.Types.ObjectId();
      user.password = await bcrypt.hash(user.password, 12);
      user.characters = userCharacters[idx].map(character => { return { _id: new mongoose.Types.ObjectId(), ...character } });
    }

    let campaigns = [
      { name: "Dare to Dream", dm: 1, characters: [[3, 0], [11, 0], [14, 0], [8, 0], [6, 1]] },
      { name: "Vision for Victory", dm: 5, characters: [[13, 0], [18, 1], [6, 0]] },
      { name: "Making Room", dm: 2, characters: [[1, 0], [20, 0], [19, 0], [4, 1]] },
      { name: "The Promise", dm: 19, characters: [[7, 0], [4, 0]] },
      { name: "Living Stones", dm: 12, characters: [[7, 1], [2, 0], [13, 2], [1, 1], [19, 2]] },
      { name: "First the Kingdom", dm: 9, characters: [[2, 1], [12, 0], [15, 0]] },
      { name: "Thrive", dm: 7, characters: [[15, 1], [6, 2], [19, 1], [18, 0]] },
    ];

    campaigns.forEach(campaign => {
      campaign.dm = users[campaign.dm]._id;
      campaign.characters = campaign.characters.map(character => users[character[0]].characters[character[1]]._id)
    });

    await User.insertMany(users);
    await Campaign.insertMany(campaigns);
    res.status(200).send("Database successfully resetted");
  } catch (err) {
    res.status(500).send(`[ERROR] POST /reset => ${err.message}`);
  }
}
