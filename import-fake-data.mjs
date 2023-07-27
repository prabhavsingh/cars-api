import { faker } from "@faker-js/faker";
import { connectToMongoDB, client, db } from "./db.mjs";

// Function to generate a random user
function generateUser() {
  return {
    user_email: faker.internet.email(),
    user_id: faker.string.uuid(),
    user_location: faker.location.streetAddress(),
    user_info: faker.internet.userName(),
    password: faker.internet.password(),
    vehicle_info: [],
  };
}

// Function to generate a random dealership
function generateDealership() {
  return {
    dealership_email: faker.internet.email(),
    dealership_id: faker.string.uuid(),
    dealership_name: faker.company.name(),
    dealership_location: faker.location.streetAddress(),
    password: faker.internet.password(),
    dealership_info: {
      description: faker.lorem.paragraph(),
      website: faker.internet.url(),
    },
    cars: [],
    deals: [],
    sold_vehicles: [],
  };
}

// Function to generate a random car
function generateCar() {
  return {
    car_id: faker.string.uuid(),
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
    deal_id: faker.string.uuid(),
    car_id: carId,
    deal_info: {
      discount: faker.commerce.price({ min: 5, max: 25 }),
      expiration_date: faker.date.future(),
    },
  };
}

async function insertDummyData() {
  try {
    await connectToMongoDB();

    //users
    const userCollection = db.collection("userCollection");
    const numOfUsers = 5;
    const users = Array.from({ length: numOfUsers }, () => generateUser());
    // console.log(users);
    await userCollection.insertMany(users);

    //dealership
    const dealershipCollection = db.collection("dealershipCollection");
    const numOfdealership = 5;
    const dealership = Array.from({ length: numOfdealership }, () =>
      generateDealership()
    );
    // console.log(dealership);
    await dealershipCollection.insertMany(dealership);

    //cars
    const carCollection = db.collection("carCollection");
    const numOfcars = 5;
    const cars = Array.from({ length: numOfcars }, () => generateCar());
    await carCollection.insertMany(cars);

    //deals
    const dealCollection = db.collection("dealCollection");
    for (const car of cars) {
      const deal = generateDeal(car.car_id);
      await dealCollection.insertOne(deal);
    }

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
