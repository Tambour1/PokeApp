export default {
  methods: {
    // Convertit le poids d'un Pokémon en kg
    convertWeight(weight) {
      return `${weight / 10} kg`;
    },
    // Convertit la taille d'un Pokémon en m
    convertHeight(height) {
      return `${height / 10} m`;
    },
    // Convertit le prix d'un produit
    convertPrice(price) {
      return `${price / 10} €`
    },
    // Convertit le string avec une majuscule au debut
    firstCapitalLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    // Garde le chargement
    async keepLoading() {
      await new Promise((resolve) => setTimeout(resolve, 999999));
    },
    
    // Récupère tous les sprites d'un Pokémon
    getSprites(pokemon) {
      const allSprites = [];

      if (pokemon.sprites.front_default) {
        allSprites.push(pokemon.sprites.front_default);
      }

      if (pokemon.sprites.front_shiny) {
        allSprites.push(pokemon.sprites.front_shiny);
      }

      if (pokemon.sprites.versions) {
        Object.values(pokemon.sprites.versions).forEach((generation) => {
          Object.values(generation).forEach((version) => {
            if (version?.front_default) {
              allSprites.push(version.front_default);
            }
          });
        });
      }

      return allSprites;
    },    
    // Ouvre le sélecteur de sprite
    openSpriteSelector(pokemon) {
      this.currentPokemon = pokemon;
    },
    // Ferme le sélecteur de sprite
    closeSpriteSelector() {
      this.currentPokemon = null;
    },
  },
};
