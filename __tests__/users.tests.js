const request = require("supertest");
const app = require("../server");
const User = require("../src/models/user");

//oksssss
// Simulamos (mock) el comportamiento de Mongoose
jest.mock("../src/models/User");

beforeEach(() => {
  User.find = jest.fn();
});

describe("🧩 GET /users/getall", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpia los mocks antes de cada test
  });

  it("debería devolver una lista de usuarios", async () => {
    // Simulamos lo que devolvería la BD
    const mockUsuarios = [
      { _id: "1", nombre: "Juan", email: "juan@correo.com", idRol: 1 },
      { _id: "2", nombre: "Ana", email: "ana@correo.com", idRol: 2 },
    ];

    User.find.mockResolvedValue(mockUsuarios);

    const response = await request(app).get("/users/getall");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUsuarios);
    expect(User.find).toHaveBeenCalledTimes(1);
  });

  it("debería devolver 500 si hay un error", async () => {
    User.find.mockRejectedValue(new Error("Error"));

    const response = await request(app).get("/users/getall");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({error: "Error", message: "Error al obtener los usuarios" });
  });
});
