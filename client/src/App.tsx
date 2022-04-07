import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField'
import DateAdapter from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import React from 'react';
import Button from '@mui/material/Button';
import CurrencyRubleIcon from '@mui/icons-material/CurrencyRuble';
import './App.css';

interface AppState {
  cardNumber: string
  expDate: string,
  cvv: string
  amount: string,
}
interface MyProps {
}

class App extends React.Component<MyProps, AppState> {

  constructor(props: any) {
    super(props);
    this.state = {
      cardNumber: '',
      expDate: '',
      cvv: '',
      amount: '',
    };
    this.handleValidation = this.handleValidation.bind(this);
    this.validateCcv = this.validateCcv.bind(this);
    this.validateCard = this.validateCard.bind(this);
    this.validateAmount = this.validateAmount.bind(this);
    this.validateExpDate = this.validateExpDate.bind(this);
  }

  processUrl = "http://localhost:8080/process"

  reCVV = /^[0-9]{3}$/i
  reAmount = /^[1-9][1-9]*$/i
  reEXP = /([0][1-9]|[1][0-2])\/[\d]{4}/i
  reCard = /^[0-9]{16}$/i

  async handleValidation(e: any) {
    if (this.validateAmount() && this.validateCard() && this.validateExpDate() && this.validateCcv() && !this.validateEmpty()) {
      console.log("100000")
      fetch(this.processUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ card_number: this.state.cardNumber, exp_date: this.state.expDate, cvv: this.state.cvv, amount: this.state.amount })
      }).then((res) => {
        return res.json()
      }).then((data) => {
        alert(JSON.stringify(data))
      });
    }
  }

  validateEmpty(): boolean {
    return this.state.cvv === '' || this.state.cardNumber === '' || this.state.expDate === '' || this.state.amount === ''
  }

  validateCcv(): boolean {
    return !!(this.state.cvv.match(new RegExp(this.reCVV))) && this.state.cvv.length === 3;
  }

  validateCard(): boolean {
    return !!this.state.cardNumber.match(new RegExp(this.reCard)) && this.state.cardNumber.length === 16;

  }

  validateExpDate(): boolean {
    return !!this.state.expDate.match(new RegExp(this.reEXP));
  }

  validateAmount(): boolean {
    return !!this.state.amount.match(new RegExp(this.reAmount))
  }

  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box>
          <Grid container direction={"column"} className="App" >
            <Grid container paddingBottom={2} alignItems={"center"} justifyContent={"center"} >
              <Grid item xs={7}>
                <h1>Process payment</h1>
              </Grid>
            </Grid>
            <Grid container paddingBottom={2} alignItems={"center"} justifyContent={"center"} >
              <Grid item xs={7}>
                <TextField fullWidth id="standard-basic" label="CARDHOLDER NAME" variant="standard" />
              </Grid>
            </Grid>

            <Grid container paddingBottom={2} alignItems={"center"} justifyContent={"center"}>
              <Grid item xs={7}>
                <TextField fullWidth
                  value={this.state.cardNumber}
                  onChange={event => this.setState({ cardNumber: event.target.value })}
                  // eslint-disable-next-line no-useless-escape
                  error={!this.validateCard() && this.state.cardNumber !== ''}
                  // eslint-disable-next-line no-useless-escape
                  helperText={!this.validateCard() && this.state.cardNumber !== '' ? '16 numbers required' : ''}
                  id="standard-basic" label="CARD NUMBER" variant="standard" InputProps={{ inputProps: { maxlength: 16, inputMode: 'numeric', pattern: "[0-9]*" } }} />
              </Grid>
            </Grid>

            <Grid container spacing={1} paddingBottom={1} alignItems={"center"} justifyContent={"center"} >
              <Grid item xs={4.5} >
                <LocalizationProvider dateAdapter={DateAdapter} >
                  <DatePicker
                    disableOpenPicker
                    views={["month", "year"]}
                    label="EXPIRY DATE"
                    mask="__/____"
                    inputFormat="MM/yyyy"
                    minDate={new Date("01-2020")}
                    value={this.state.expDate}
                    onChange={event => {
                      this.setState({
                        expDate: event!.toLocaleDateString("en-GB", { // you can use undefined as first argument
                          year: "numeric",
                          month: "2-digit",
                        })
                      })
                    }}
                    renderInput={(params) => <TextField {...params} helperText={this.state.expDate !== "" && !this.validateExpDate() ? 'MM/YYYY only' : ''} error={!this.validateExpDate() && this.state.expDate !== ""} />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth
                  id="standard-basic" label="CVV"
                  value={this.state.cvv}
                  onChange={event => this.setState({ cvv: event.target.value })}
                  helperText={!this.validateCcv() && this.state.cvv !== '' ? '3 numbers required' : ''}
                  error={!this.validateCcv() && this.state.cvv !== ''}
                  variant="standard" InputProps={{ inputProps: { textAlign: 'center', maxlength: 3, inputMode: 'numeric', pattern: "[0-9]*" } }} />
              </Grid>
            </Grid>

            <Grid container spacing={2} paddingBottom={2} alignItems={"center"} justifyContent={"center"} >
              <Grid item>
                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                  <CurrencyRubleIcon sx={{ mr: 1, my: 0.5 }} />
                  <TextField id="standard-basic"
                    value={this.state.amount}
                    onChange={event => this.setState({ amount: event.target.value })}
                    fullWidth label="PAYMENT AMOUNT"
                    helperText={this.state.amount !== "" && !this.validateAmount() ? 'Only numbers allowed' : ''}
                    error={!this.validateAmount() && this.state.amount !== ""}
                    variant="standard"
                    InputProps={{ inputProps: { textAlign: 'center', inputMode: 'numeric', pattern: "[1-9]+[0-9]*" } }} />
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={3} alignItems={"center"} justifyContent={"center"} >
              <Grid item>
                <Button variant="contained" onClick={this.handleValidation}>PAY</Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </div>

    );
  }
}

export default App;
