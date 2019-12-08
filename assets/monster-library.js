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
                100,    //EV
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
                    "type": 3,
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
                100,    //EV
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
                    "type": 2,
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
                    "type": 3,
                    "base-power": 0,
                    "base-accuracy": 0,
                    "effect": {
                        "heal": 50
                    },
                    "limit": 1
                }
            ]
        }
    ];

export { monsterLibraryDB };