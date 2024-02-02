import React, { useReducer,useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import './App.css';


const api = axios.create({
  baseURL: "https://api.mercadopago.com"
});

api.interceptors.request.use(async config => {

  const token = process.env.REACT_APP_TOKEN_MERCADO_PAGO_PUBLIC;
  config.headers.Authorization = `Bearer ${token}`;

  //config.headers['X-Idempotency-Key'] = generateIdempotencyKey();

  return config;
});

// const generateIdempotencyKey = () => {
//   return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
// };


const formReducer = (state, event) => {
  return {
    ...state,
    [event.name]: event.value
  }
}

function App() {

  const [formData, setFormdata] = useReducer(formReducer, {})
  const [responsePayment, setResponsePayment] = useState(false)
  const [linkBuyMercadoPago, setLinkBuyMercadoPago] = useState(false)
  const [statusPayment, setStatusPayment] = useState(false)


  const handleChange = event => {
    setFormdata({
      name: event.target.name,
      value: event.target.value
    })
  }

  const getStatusPayment = () => {
    api
      .get(`v1/payments/${responsePayment.data.id}`)
      .then(response => {
        if (response.data.status === "approved") {

        }
      })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const body = {
      "transaction_amount": 1,
      "description": "Produto teste de desenvolvimento",
      "payment_method_id": "pix",
      "payer": {
        "email": "inv72kmaster@gmail.com",
        "first_name": "Yuri",
        "last_name": "Nunes",
        "identification": {
          "type": "CPF",
          "number": "01234567890"
        }
      }
      
    }


    api.post("v1/payments", body).then(response => {

      setResponsePayment(response)
      setLinkBuyMercadoPago(response.data.point_of_interaction.transaction_data.ticket_url)
    }).catch(err => {
      // alert(err)
    })
  }


  return (
    <div className="App">
      <header className="App-header">
        <p>
          PIX com API do Mercado pago
        </p>

        {
          !responsePayment && <form onSubmit={handleSubmit}>

            <div>
              <label>E-mail</label>
              <input onChange={handleChange} name="email" />
            </div>

            <div>
              <label>Nome</label>
              <input onChange={handleChange} name="nome" />
            </div>

            <div>
              <label>CPF</label>
              <input onChange={handleChange} name="cpf" />
            </div>

            <div>
              <button type="submit">Pagar</button>
            </div>
          </form>
        }

        {responsePayment &&
          <button onClick={getStatusPayment}>Verificar status pagamento</button>
        }

        {
          linkBuyMercadoPago && !statusPayment &&
          < iframe src={linkBuyMercadoPago} width="400px" height="620px" title="link_buy" />
        }

        {
          statusPayment &&
          <h1>
            Compra Aprovada
          </h1>
        }


      </header>
    </div >
  );
}

export default App;