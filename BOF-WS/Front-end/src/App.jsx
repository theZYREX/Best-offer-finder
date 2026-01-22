import NavBar from "./components/NavBar.tsx";
import Card from "./components/Card.tsx";
import NavMenu from "./components/NavMenu.tsx";

function App() {
    const cardsData = [
        {
            external_id: "101",
            title: "Iphone 13",
            price: "26 500",
            images: ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
            url: "/product/101",
            date: "2023-10-01",
        }];
  return (
      <>
          <NavBar />
          {cardsData.map((item) => (
              <Card
                  key={item.external_id} // Обязательный уникальный ключ для React
                  external_id={item.external_id}
                  title={item.title}
                  price={item.price}
                  images={item.images}
                  url={item.url}
                  date={item.date}
              />
          ))}
          <Card />
          <Card />
          <Card />
      </>
  )
}
export default App
