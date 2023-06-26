

var pokemon_data = []; // all pokemon data 
var pokemon_info = []; // 1 pokemon desctiption and info 
const pokemon_party = window.localStorage;
const pokemon_list = document.getElementById('img-list');
// pokemon_party.clear();
pokemon_party.setItem('list', [])



const setImageParty = (pkmImage,id) => {
    // add pokemons image to hmtl
    var image = document.createElement("img");
    image.setAttribute('src', pkmImage);
    image.setAttribute('id', "img"+id); //unique id to destroy if necesary
    image.setAttribute('height', '100px');
    image.setAttribute('width', '100px');
    pokemon_list.append(image)
    
}


var get_pokemonImage = async (number) => {
    /* F: get front image  from a certain pokemon
       I: the pokemon id 
       O: pokemon image
       */
    const body =
        await fetch('https://pokeapi.co/api/v2/pokemon/' + number).then(
            res => res.json()
        );
        setImageParty(body.sprites.front_default,number);
    
    return body.sprites.front_default;
    }



var get_pokemons = async (number) => {
    /* F: get a certain number of pokemons 
           I: the number of pokemons you want  
           O: data from api 
           */
    const body =
        await fetch('https://pokeapi.co/api/v2/pokemon/?limit=' + number).then(
            res => res.json()
        );
    var con = 1;
    var data = []
    body.results.forEach(item => {
        item["details"] = "<button  data-toggle=\"modal\" data-target=\"#exampleModalLong\" class=\"details mybtn btn-secondary\">View Details</button>";// Select Pokemon details
        item["select"] = "<button class=\"select mybtn btn-success\">Select Pokemon</button>";// add button for select 

        item["number"] = con; // add pokemon id 
        data.push(item);
        con += 1
    });
    return data;
};




var get_pokemonData = async (number) => {
    /* F: get all data from a certain pokemon
       I: the pokemon id 
       O: All data JSON
       */
    const body =
        await fetch('https://pokeapi.co/api/v2/pokemon/' + number).then(
            res => res.json()
        );
    let types = "";
    let moves = "";
    body.types.forEach(item => { types += (item.type.name + "\n") }) //list types
    body.moves.forEach(item => { moves += (item.move.name + ", ") }) //list moves
    // access jquery fields by id
    $('#exampleModalLongTitle').text(number + ": " + body.species.name);
    $('#pk-weight').text("weight" + ": " + body.weight + " lb")
    $('#pk-types').text("Types: \n" + types)
    $('#pk-moves').text("moves: \n" + moves)
    $("#pk-img").attr("src", body.sprites.front_default);
    return body;
};




const addPokemonParty = (id) => {
    var x = pokemon_party.getItem("list")
    pokemon_party.setItem('list', x + id + ","); //add pokemon to localstorage
}

const party_button_toggle = (button, id) => {
    var party = pokemon_party.getItem("list")

    if (party.includes(id)) { // remove from party
        button.removeClass("btn btn-light")
        button.text("Select Pokemon")
        button.addClass("btn-success");
        button.parents('tr').removeClass("bg-primary");
        tempParty = party.replace(id + ",", '');
        $('#img'+id).remove(); // remove pokemon's image from main page
        pokemon_party.setItem('list', tempParty);

    }
    else if ((party.split(",").length - 1) >= 6) {
        alert("Game Party is complete"); // party complete
    }
    else { //add to party
        button.removeClass("btn-success");
        button.text("Remove from party")
        button.addClass("btn btn-light"); //bg-success
        button.parents('tr').addClass("bg-primary");
        addPokemonParty(id); // add local storage
        get_pokemonImage(id) // add image to html
        
    }


}

// document ready  ###########################

var $table = $('#pokemonlist');//get table


//Initialise Bootstrap Table
$(async function () {
    pokemon_data = await get_pokemons(251); //wait for pokemons to load 

    $table.bootstrapTable({
        data: pokemon_data
    });
    //$table.bootstrapTable('togglePagination');
});


$table.on("click", ".details", function () {
    pokemon_id = $(this).parents('tr').attr('data-uniqueid'); // get pokemon id 
    pokemon_info = get_pokemonData(pokemon_id);

});

$table.on("click", ".select", function () {

    pokemon_id = $(this).parents('tr').attr('data-uniqueid');
    party_button_toggle($(this), pokemon_id);
    
    // add pokemon to party 
});

//

