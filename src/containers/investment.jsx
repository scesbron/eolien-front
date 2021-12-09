import React from 'react';
import { connect } from 'react-redux';
import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { PDFViewer } from '@react-pdf/renderer';

import { userType } from '../types';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';
import { sum } from '../utils/math';
import Attestation from '../documents/attestation';

const useStyles = makeStyles({
  container: {
    paddingBottom: '72px',
  },
  title: {
    marginTop: '1rem',
    marginBottom: '1rem',
  },
});

const renderTable = (values, name) => {
  const totalQuantity = sum(values.map((value) => value.quantity));
  const totalAmount = sum(values.map((value) => value.quantity * value[name].amount));
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">Nom</TableCell>
            <TableCell align="right">Montant</TableCell>
            <TableCell align="center">Date achat</TableCell>
            <TableCell align="center">Quantité</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {values.map((value) => (
            <TableRow key={value.id}>
              <TableCell align="center">{value[name].name}</TableCell>
              <TableCell align="right">{formatCurrency(value[name].amount)}</TableCell>
              <TableCell align="center">{formatDate(value.date)}</TableCell>
              <TableCell align="center">{value.quantity}</TableCell>
              <TableCell align="right">{formatCurrency(value.quantity * value[name].amount)}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell align="center">Total</TableCell>
            <TableCell />
            <TableCell />
            <TableCell align="center">{totalQuantity}</TableCell>
            <TableCell align="right">{formatCurrency(totalAmount)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const Investment = ({ user }) => {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Typography variant="h4" className={classes.title}>Investissement</Typography>
      {renderTable(user.shares, 'share')}
      <Typography variant="h4" className={classes.title}>Prêts</Typography>
      {renderTable(user.loans, 'loan')}
      <PDFViewer width="100%" height="400px">
        <Attestation />
      </PDFViewer>
      {/*
      <PDFDownloadLink document={<Attestation />} fileName="attestation.pdf">
        {({ loading }) => (loading ? 'Chargement du document...' : 'Télécharger mon attestation')}
      </PDFDownloadLink>
      */}
    </Container>
  );
};

Investment.propTypes = {
  user: userType.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user.current,
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Investment);
