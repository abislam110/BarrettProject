export const tourScenes = {
  lobby: {
    image: "/maps/img2.jpg",
    arrows: [
      {
        yaw: "310deg",
        pitch: "0deg",
        target: "hallway",
        label: "",
      },
      {
        yaw: "220deg",
        pitch: "0deg",
        target: "courtyard",
      label: "",
      },
    ],
  },

  hallway: {
    image: "/maps/img3.jpg",
    arrows: [
      {
        yaw: "130deg", //back to lobby
        pitch: "0deg",
        target: "lobby",
       label: "",
      },
      {
        yaw: "235deg",
        pitch: "0deg",
        target: "classroom",
    label: "",
      },
    ],
  },

  classroom: {
    image: "/maps/img4.jpg",
    arrows: [
      {
        yaw: "50deg",
        pitch: "0deg",
        target: "hallway",
       label: "",
      },
      {
        yaw: "235deg",
        pitch: "0deg",
        target: "innovation",
       label: "",
      }
    ],
  },


innovation: {
    image: "/maps/img5.jpg",
    arrows: [
      {
        yaw: "330deg",
        pitch: "0deg",
        target: "classroom",
        label: "",
      },
      {
        yaw: "20deg",
        pitch: "0deg",
        target: "courtyard",
        label: "",
      },
    ],
  },
  courtyard: {
    image: "/maps/img1.jpg",
    arrows: [
      {
        yaw: "217deg",
        pitch: "0deg",
        target: "innovation",
        label: "",
      },
      {
        yaw: "360deg",
        pitch: "0deg",
        target: "lobby",
        label: "",
      },
    ],
  },


} as const