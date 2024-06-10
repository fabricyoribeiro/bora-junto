import express from 'express';
import {routes} from './src/routes/index.js'
import cors from "cors"

const app = express();

app.use(express.json())
app.use(cors({
    origin: "*", // Permite apenas solicitações deste domínio
    methods: "GET,PUT,POST,DELETE", // Métodos permitidos
    optionsSuccessStatus: 204 // Define o status de sucesso para preflight requests para 204 fff
}))


app.use(routes)

app.get("/", (req, res) => {
    return res.json({ hello: 'world' })
})
// app.listen({port})

app.listen(3030, '0.0.0.0', () => {
    console.log('listening on port 3030');
  });
  