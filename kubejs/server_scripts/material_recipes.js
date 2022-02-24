
materials = ["titanium", "tungsten", "chrome"];

shapes = {
    "compression": ["III", "III", "III"],
    "pickaxe": ["III", " S ", " S "],
    "sword": [" I ", " I ", " S "],
    "shovel": [" I ", " S ", " S "],
    "hoe": ["II ", " S ", " S "],
    "axe": ["II ", "IS ", " S "],
    "helmet": ["III", "I I", "   "],
    "chestplate": ["I I", "III", "III"],
    "leggings": ["III", "I I", "I I"],
    "boots": ["I I", "I I", "   "],
    "gear": [" I ", "ISI", " I "]
}

function multi_smelt(event, output, input, blasting) {
    event.smelting(output, input);
    if (blasting) {
        event.blasting(output, input);
    }
}

function shaped_recipe(event, shape, inputs, output) {
    event.shaped(output, shapes[shape], inputs)
}

function ore_process(event, material) {
    event.custom({
        "type": "thermal:pulverizer",
        "ingredient": {
            "item": "kubejs:ore_" + material
        },
        "result": [
            {
                "item": "kubejs:dust_" + material,
                "chance": 2.25
            },
            {
                "item": "minecraft:gravel",
                "chance": 0.2
            }
        ],
        "experience": 0.5
    });

    event.custom({
        "type": "mekanism:enriching",
        "input": {
            "ingredient": {
                "item": "kubejs:ore_" + material
            }
        },
        "output": {
            "item": "kubejs:dust_" + material,
            "count": 2.5
        }
    });

    event.custom({
        "type": "mekanism:dissolution",
        "itemInput": {
            "ingredient": {
                "item": "kubejs:ore_" + material
            }
        },
        "gasInput": {
            "amount": 1,
            "gas": "mekanism:sulfuric_acid"
        },
        "output": {
            "slurry": "kubejs:slurry_dirty_" + material,
            "amount": 1000,
            "chemicalType": "slurry"
        }
    });

    event.custom({
        "type": "mekanism:washing",
        "fluidInput": {
            "amount": 5,
            "tag": "minecraft:water"
        },
        "slurryInput": {
            "amount": 1,
            "slurry": "kubejs:slurry_dirty_" + material
        },
        "output": {
            "gas": "kubejs:slurry_clean_" + material,
            "amount": 1
        }
    })

    multi_smelt(event, "kubejs:ingot_" + material, "kubejs:dust_" + material, true);
}

// recipes
onEvent("recipes", event => {
    for (var i in materials) {
        var tool_input = { "S": "minecraft:stick", "I": "kubejs:ingot_" + materials[i] };
        shaped_recipe(event, "compression", { "I": "kubejs:ingot_" + materials[i] }, "kubejs:block_" + materials[i]);
        shaped_recipe(event, "compression", { "I": "kubejs:nugget_" + materials[i] }, "kubejs:ingot_" + materials[i]);
        shaped_recipe(event, "pickaxe", tool_input, "kubejs:pickaxe_" + materials[i]);
        shaped_recipe(event, "sword", tool_input, "kubejs:sword_" + materials[i]);
        shaped_recipe(event, "shovel", tool_input, "kubejs:shovel_" + materials[i]);
        shaped_recipe(event, "hoe", tool_input, "kubejs:hoe_" + materials[i]);
        shaped_recipe(event, "axe", tool_input, "kubejs:axe_" + materials[i]);
        shaped_recipe(event, "helmet", { "I": "kubejs:ingot_" + materials[i] }, "kubejs:helmet_" + materials[i]);
        shaped_recipe(event, "chestplate", { "I": "kubejs:ingot_" + materials[i] }, "kubejs:chestplate_" + materials[i]);
        shaped_recipe(event, "leggings", { "I": "kubejs:ingot_" + materials[i] }, "kubejs:leggings_" + materials[i]);
        shaped_recipe(event, "boots", { "I": "kubejs:ingot_" + materials[i] }, "kubejs:boots_" + materials[i]);
        multi_smelt(event, "kubejs:ingot_" + materials[i], "kubejs:ore_" + materials[i]);
        event.shapeless("9x kubejs:ingot_" + materials[i], ["kubejs:block_" + materials[i]]);
        event.shapeless("9x kubejs:nugget_" + materials[i], ["kubejs:ingot_" + materials[i]]);
        event.recipes.thermal.press("kubejs:plate_" + materials[i], "kubejs:ingot_" + materials[i]);
        ore_process(event, materials[i]);
    }
});

