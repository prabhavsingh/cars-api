import { faker } from "@faker-js/faker";
import { connectToMongoDB, client, db } from "./db.mjs";

let vechileIndices = [];
let dealIndices = [];
let carIndices = [];
const randomInsert = (name_info, value, indices) => {
  return value
    .map((el, i) => {
      if (Math.floor(Math.random() * 2) === 1 && !indices.includes(i)) {
        indices.push(i);
        return { [name_info]: el._id };
      }
      return null;
    })
    .filter(Boolean);
};

// Function to generate a random user
function generateUser(soldVehicles) {
  const vehicle_info = randomInsert("vehicle_id", soldVehicles, vechileIndices);

  return {
    user_email: faker.internet.email(),
    user_location: faker.location.streetAddress(),
    user_info: faker.internet.userName(),
    password: faker.internet.password(),
    vehicle_info,
  };
}

// Function to generate a random dealership
function generateDealership(cars, deal, soldVehicles) {
  const dealership_cars = randomInsert("car_id", cars, carIndices);
  const dealership_deals = randomInsert("deal_id", deal, dealIndices);
  const dealership_soldcars = randomInsert(
    "vehicle_id",
    soldVehicles,
    vechileIndices
  );

  return {
    dealership_email: faker.internet.email(),
    dealership_name: faker.company.name(),
    dealership_location: faker.location.streetAddress(),
    password: faker.internet.password(),
    dealership_info: {
      description: faker.lorem.paragraph(),
      website: faker.internet.url(),
    },
    cars: dealership_cars,
    deals: dealership_deals,
    sold_vehicles: dealership_soldcars,
  };
}

// Function to generate a random car
function generateCar() {
  return {
    type: faker.vehicle.type(),
    name: faker.vehicle.vehicle(),
    model: faker.vehicle.model(),
    car_info: {
      color: faker.color.human(),
      price: faker.commerce.price({ min: 10000, max: 50000 }),
    },
  };
}

// Function to generate a random deal
function generateDeal(carId) {
  return {
    car_id: carId,
    deal_info: {
      discount: faker.commerce.price({ min: 5, max: 25 }),
      expiration_date: faker.date.future(),
    },
  };
}

function generateSoldVechile(carId) {
  return {
    car_id: carId,
    vehicle_info: {
      sold_price: faker.commerce.price({ min: 5000, max: 30000 }),
      sale_date: faker.date.past(),
    },
  };
}

async function insertDummyData() {
  try {
    await connectToMongoDB();
    //cars
    const carCollection = db.collection("carCollection");
    const numOfcars = 20;
    const cars = Array.from({ length: numOfcars }, () => generateCar());
    await carCollection.insertMany(cars);

    //deals
    const dealCollection = db.collection("dealCollection");
    const deal = cars.map((car) => generateDeal(car._id));
    await dealCollection.insertMany(deal);

    //sold vechicles
    const soldVehicleCollection = db.collection("soldVehicleCollection");
    const soldVehicles = cars.map((car) => generateSoldVechile(car._id));
    await soldVehicleCollection.insertMany(soldVehicles);

    //users
    const userCollection = db.collection("userCollection");
    const numOfUsers = 5;
    const users = Array.from({ length: numOfUsers }, () =>
      generateUser(soldVehicles)
    );
    vechileIndices = [];
    // console.log(users);
    await userCollection.insertMany(users);

    //dealership
    const dealershipCollection = db.collection("dealershipCollection");
    const numOfdealership = 5;
    const dealership = Array.from({ length: numOfdealership }, () =>
      generateDealership(cars, deal, soldVehicles)
    );
    vechileIndices = [];
    // console.log(dealership);
    await dealershipCollection.insertMany(dealership);

    console.log("Dummy data inserted successfully.");
  } catch (error) {
    console.error("Error inserting dummy data:", error);
  } finally {
    client.close();
  }
}
async function deleteDummyData() {
  try {
    await connectToMongoDB();
    //users
    const userCollection = db.collection("userCollection");
    await userCollection.deleteMany({});

    //dealership
    const dealershipCollection = db.collection("dealershipCollection");
    await dealershipCollection.deleteMany({});

    //cars
    const carCollection = db.collection("carCollection");
    await carCollection.deleteMany({});

    //deals
    const dealCollection = db.collection("dealCollection");
    await dealCollection.deleteMany({});

    //sold vechicles
    const soldVehicleCollection = db.collection("soldVehicleCollection");
    await soldVehicleCollection.deleteMany({});

    console.log("Dummy data deleted successfully.");
  } catch (error) {
    console.error("Error deleting dummy data:", error);
  } finally {
    client.close();
  }
}

if (process.argv[2] === "--import") {
  insertDummyData();
} else if (process.argv[2] === "--delete") {
  deleteDummyData();
}
