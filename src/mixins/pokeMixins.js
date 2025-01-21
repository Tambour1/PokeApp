export default {
  methods: {
    convertWeight(weight) {
      return `${weight / 10} kg`;
    },
    convertHeight(height) {
      return `${height / 10} m`;
    },
    convertPrice(price) {
      return `${price / 10} €`
    }
  },
};
