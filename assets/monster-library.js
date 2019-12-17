let monsterLibraryDB =
    [
        {
            "name": "Vulpix",
            "type": "Fire",
            "id": 37,
            "stats": [
                100,    //HP
                50,     //AT
                50,     //DF
                100,    //AC
                0,       //EV
                5       //SP
            ],
            "moves": [
                {
                    "name": "Tackle",
                    "type": 0,
                    "base-power": 40,
                    "base-accuracy": 100,
                    "effect": null,
                    "limit": null
                },
                {
                    "name": "Tail Whip",
                    "type": 1,
                    "base-power": 0,
                    "base-accuracy": 100,
                    "effect": {
                        "stat": "DF",
                        "value": "-10"
                    },
                    "limit": null
                },
                {
                    "name": "Ember",
                    "type": 2,
                    "base-power": 30,
                    "base-accuracy": 80,
                    "effect": {
                        "status": "Burn",
                        "chance": 20
                    },
                    "limit": null
                },
                {
                    "name": "Potion",
                    "type": 4,
                    "base-power": 0,
                    "base-accuracy": 0,
                    "effect": {
                        "heal": 50
                    },
                    "limit": 1
                }
            ]
        },
        {
            "name": "Poliwhirl",
            "type": "Water",
            "id": 61,
            "stats": [
                100,    //HP
                50,     //AT
                50,     //DF
                100,    //AC
                0,       //EV
                5       //SP
            ],
            "moves": [
                {
                    "name": "Pound",
                    "type": 0,
                    "base-power": 40,
                    "base-accuracy": 100,
                    "effect": null,
                    "limit": null
                },
                {
                    "name": "Bubble",
                    "type": 3,
                    "base-power": 40,
                    "base-accuracy": 70,
                    "effect": {
                        "stat": "SP",
                        "value": "-1"
                    },
                    "limit": null
                },
                {
                    "name": "Ice Ball",
                    "type": 2,
                    "base-power": 30,
                    "base-accuracy": 80,
                    "effect": {
                        "status": "Freeze",
                        "chance": 15
                    },
                    "limit": null
                },
                {
                    "name": "Potion",
                    "type": 4,
                    "base-power": 0,
                    "base-accuracy": 0,
                    "effect": {
                        "heal": 50
                    },
                    "limit": 1
                }
            ]
        },
        {
            "name": "Luxio",
            "type": "Electric",
            "id": 404,
            "stats": [
                100,    //HP
                50,     //AT
                45,     //DF
                100,    //AC
                0,       //EV
                6       //SP
            ],
            "moves": [
                {
                    "name": "Tackle",
                    "type": 0,
                    "base-power": 40,
                    "base-accuracy": 100,
                    "effect": null,
                    "limit": null
                },
                {
                    "name": "Growl",
                    "type": 1,
                    "base-power": 0,
                    "base-accuracy": 100,
                    "effect": {
                        "stat": "AT",
                        "value": "-10"
                    },
                    "limit": null
                },
                {
                    "name": "Spark",
                    "type": 2,
                    "base-power": 30,
                    "base-accuracy": 90,
                    "effect": {
                        "status": "Paralyze",
                        "chance": 40
                    },
                    "limit": null
                },
                {
                    "name": "Potion",
                    "type": 4,
                    "base-power": 0,
                    "base-accuracy": 0,
                    "effect": {
                        "heal": 50
                    },
                    "limit": 1
                }
            ]
        },
        {
            "name": "Cherrim",
            "type": "Grass",
            "id": 421,
            "stats": [
                100,    //HP
                40,     //AT
                60,     //DF
                100,    //AC
                0,      //EV
                4       //SP
            ],
            "moves": [
                {
                    "name": "Tackle",
                    "type": 0,
                    "base-power": 40,
                    "base-accuracy": 100,
                    "effect": null,
                    "limit": null
                },
                {
                    "name": "Worry Seed",
                    "type": 1,
                    "base-power": 0,
                    "base-accuracy": 100,
                    "effect": {
                        "stat": "AC",
                        "value": "-10"
                    },
                    "limit": null
                },
                {
                    "name": "Solar Beam",
                    "type": 0,
                    "base-power": 65,
                    "base-accuracy": 45,
                    "effect": {
                        "status": null,
                        "chance": null
                    },
                    "limit": null
                },
                {
                    "name": "Mini-Potion",
                    "type": 4,
                    "base-power": 0,
                    "base-accuracy": 0,
                    "effect": {
                        "heal": 30
                    },
                    "limit": 3
                }
            ]
        }
    ];

export { monsterLibraryDB };