// Music data structure
const musicData = {
    dhrupad: {
        title: "Dhrupad",
        gharanas: {
            dagar: {
                name: "Dagar Gharana",
                artists: {
                    ushadDagar: {
                        name: "Ustad Nasir Moinuddin Dagar",
                        description: "Legendary Dhrupad vocalist of the Dagar tradition.",
                        youtubeLinks: [
                            {title: "Raga Yaman", url: "https://youtube.com/link1"},
                            {title: "Raga Bhairav", url: "https://youtube.com/link2"}
                        ]
                    },
                    // Add more artists
                }
            },
            bishnupur: {
                name: "Bishnupur Gharana",
                artists: {
                    // Add artists
                }
            }
            // Add more gharanas
        }
    },
    kheyal: {
        title: "Kheyal",
        gharanas: {
            kirana: {
                name: "Agra Gharana",
                artists: {
                    bhimsenJoshi: {
                        name: "Ustad Faiyaz Khan",
                        description: "One of the greatest exponents of the Kirana gharana.",
                        youtubeLinks: [
                            {title: "Raga Miyan ki Todi", url: "https://youtube.com/link3"},
                            {title: "Raga Puriya Kalyan", url: "https://youtube.com/link4"}
                        ]
                    }
                    // Add more artists
                }
            }
            // Add more gharanas
        }
    },
    instrumental: {
        title: "Instrumental",
        categories: {
            sitar: {
                name: "Senia Maihar",
                artists: {
                    raviShankar: {
                        name: "Pandit Ravi Shankar",
                        description: "World-renowned sitar maestro.",
                        youtubeLinks: [
                            {title: "Raga Jog", url: "https://youtube.com/link5"},
                            {title: "Raga Marwa", url: "https://youtube.com/link6"}
                        ]
                    }
                    // Add more artists
                }
            }
            // Add more instruments
        }
    },
    percussion: {
        title: "Percussion",
        categories: {
            tabla: {
                name: "Tabla",
                artists: {
                    zakirHussain: {
                        name: "Ustad Zakir Hussain",
                        description: "Legendary tabla virtuoso.",
                        youtubeLinks: [
                            {title: "Tabla Solo", url: "https://youtube.com/link7"},
                            {title: "Jugalbandi with Rakesh Chaurasia", url: "https://youtube.com/link8"}
                        ]
                    }
                    // Add more artists
                }
            }
            // Add more percussion instruments
        }
    }
};