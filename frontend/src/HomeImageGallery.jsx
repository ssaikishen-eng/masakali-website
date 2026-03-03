import React from "react";

// List of all images in assets/img (excluding logo, gluten, nav_bg_image, bg_image1)
const imageList = [
  require("./assets/img/onion-pakora.png"),
  require("./assets/img/masala-papad.png"),
  require("./assets/img/g1.png"),
  require("./assets/img/g2.png"),
  require("./assets/img/g3.png"),
  require("./assets/img/gg3.png"),
  require("./assets/img/gg4.png"),
  require("./assets/img/gg5.png"),
  require("./assets/img/aloo-tikki.png"),
  require("./assets/img/aloo-samosa.png"),
  require("./assets/img/26.png"),
  require("./assets/img/25.png"),
  require("./assets/img/24.png"),
  require("./assets/img/23.png"),
  require("./assets/img/22.png"),
  require("./assets/img/21.png"),
  require("./assets/img/20.png"),
  require("./assets/img/19.png"),
  require("./assets/img/18.png"),
  require("./assets/img/17.png"),
  require("./assets/img/15.png"),
  require("./assets/img/14.png"),
  require("./assets/img/12.png")
];

export default function HomeImageGallery() {
  return (
    <section style={{ width: "100%", padding: "2rem 0", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.5rem", background: "#fff" }}>
      {imageList.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={"Masakali food " + (idx + 1)}
          style={{ width: "220px", height: "180px", objectFit: "cover", borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
        />
      ))}
    </section>
  );
}
