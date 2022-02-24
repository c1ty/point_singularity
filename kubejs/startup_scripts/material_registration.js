materials = {
    "titanium": {
        "name": "Titanium",
        "level": 5,
        "symbol": "Ti",
        "melting-point": 1961,
        "uses": 1024,
        "atk-bonus": 3.0,
        "speed": 9.0,
        "ench-value": 14,
        "toughness": 2.0,
        "dmult": 15,
        "slots":  [4, 4, 4, 4],
        "knockbr": 5,
        "colour": 0x784Cf1,
        "icolor": 7884017,
        "icolor-dirty": 6241471,
        "harvest-level": 4
    },
    "tungsten": {
        "name": "Tungsten",
        "level": 6,
        "symbol": "W",
        "melting-point": 3695,
        "uses": 4096,
        "atk-bonus": 5.5,
        "speed": 7.0,
        "ench-value": 14,
        "toughness": 4.0,
        "dmult": 30,
        "slots": [4, 6, 5, 4],
        "knockbr": 10,
        "colour": 0x24221e,
        "icolor": 2368030,
        "icolor-dirty": 1184015,
        "harvest-level": 4
    },
    "chrome": {
        "name": "Chrome",
        "level": 6,
        "melting-point": 2180,
        "symbol": "Cr",
        "uses": 512,
        "atk-bonus": 0.0,
        "speed": 4.0,
        "ench-value": 14,
        "toughness": 0.5,
        "dmult": 10,
        "slots": [1, 4, 2, 1],
        "knockbr": 2,
        "colour": 0x48ff6e,
        "icolor": 4783982,
        "icolor-dirty": 2857282,
        "harvest-level": 4
    }
};

items = {
    "pickaxe": "Pickaxe",
    "sword": "Sword",
    "shovel": "Shovel",
    "hoe": "Hoe",
    "axe": "Axe",
    "helmet": "Helmet",
    "chestplate": "Chestplate",
    "leggings": "leggings",
    "boots": "Boots"
}
components = {
    "nugget": "Nugget",
    "plate": "Plate",
    "gear": "Gear",
    "dust": "Dust"
};

mekanism_processes = {
    "crystal": "Crystal", 
    "shard": "Shard", 
    "clump": "Clump", 
};

blocks = {
    "ore": "Ore",
    "block": "Block"
};

function create_tool(event, type, material, name) {
    event.create(type + "_" + material)
    .displayName(name + " " + items[type])
    .type(type)
    .tier(material);
}

function create_component(event, component, material, name) {
    event.create(component + "_" + material)
    .displayName(name + " " + components[component]);
}

function create_block(event, type, material, elem) {
    event.create(type + "_" + material)
    .displayName(elem["name"] + blocks[type])
    .harvestTool("pickaxe", elem["harvest-level"])
    .renderType("solid")
    .transparent(false)
    .tagBlockAndItem("forge:" + type + "s/" + material);
}

function mekanism_slurries(event, material, name) {
    event.create("kubejs:slurry_clean_" + material)
    .displayName("Clean " + name + " Slurry")
    .color(materials[material]["icolor"]);

    event.create("kubejs:slurry_dirty_" + material)
    .displayName("Dirty " + name + " Slurry")
    .color(materials[material]["icolor-dirty"]);
}

// ingot registration
onEvent("item.registry", event => {
    for (var m in materials) {
        console.info("registering : " + m);
        event.create("ingot_" + m)
        .displayName(materials[m]["name"] + " Ingot")
        .tooltip("§7" + materials[m]["symbol"]);
    }
});

// tool tiers
onEvent("item.registry.tool_tiers", event => {
    for (var m in materials) {
        elem = materials[m]
        console.info("registering tool-tier: " + m);
        event.add(m, tier => {
            tier.uses = elem["uses"];
            tier.speed = elem["speed"];
            tier.attackDamageBonus = elem["atk-bonus"];
            tier.level = elem["level"];
            tier.enchantmentValue = elem["ench-value"];
            tier.repairIngredient = "kubejs:ingot_" + m;
        });
    }
});

// armor tiers
onEvent("item.registry.armor_tiers", event => {
    for (var m in materials) {
        elem = materials[m];
        console.info("registering armor-tier: " + m);
        event.add(m, tier => {
            tier.durabilityMultiplier = elem["dmult"];
            tier.slotProtections = elem["slots"];
            tier.enchantmentValue = elem["ench-value"];
            tier.equipSound = "minecraft:item.armor.equip_iron";
            tier.repairIngredient = "kubejs:ingot_" + m;
            tier.toughness = elem["toughness"];
            tier.knockbackResistance = elem["knockbr"];
        });
    }
});

// tools and armor
onEvent("item.registry", event => {
    for (var m in materials) {
        var name = materials[m]["name"];
        console.info("registering " + m + " tools and armour");
        for (var t in items) {
            create_tool(event, t, m, name);
        }
    }
});

// components
onEvent("item.registry", event => {
    for (var m in materials) {
        var name = materials[m]["name"];
        console.info("registering " + m + " components");
        for (var c in components) {
            create_component(event, c, m, name);
            for (var t in mekanism_processes) {
                event.create("kubejs:" + t + "_" + m)
                .displayName(name + " " + mekanism_processes[t]);
            }
            event.create("kubejs:dirty_dust_" + m)
            .displayName("Dirty " + name + "Dust");
        }
    }
});

// blocks
onEvent("block.registry", event => {
    for (var m in materials) {
        console.info("registering " + m + " blocks");
        create_block(event, "ore", m, materials[m]);
        create_block(event, "block", m, materials[m]);
    }
});

// gas registration
onEvent("slurry.registry", event => {
    for (var m in materials) {
        var name = materials[m]["name"];
        console.info("registering " + m + " slurries");
        mekanism_slurries(event, m, name);
    }
});