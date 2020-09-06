function makePostsArray() {
  //let d = new Date().toUTCString();
  return [
    {
      id: 1,
      user_id: 2,
      content: "blah blah",
      voters: "",
      created: new Date(),
    },
    {
      id: 2,
      user_id: 3,
      content: "blah blah bah di blah",
      voters: "",
      created: new Date(),
    },
    {
      id: 3,
      user_id: 3,
      content: "blah blah blah di dooo",
      voters: "",
      created: new Date(),
    },
  ];
}

module.exports = {
  makePostsArray,
};
