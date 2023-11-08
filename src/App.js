import React, { useState } from 'react';
import { createStaticPix, hasError } from 'pix-utils';
import QRCode from 'qrcode.react';

function validaCPF(cpf) {
  var Soma = 0;
  var Resto;
  var strCPF = String(cpf).replace(/[^\d]/g, '');

  if (strCPF.length !== 11) return false;

  if ([
    '00000000000',
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999',
  ].indexOf(strCPF) !== -1) return false;

  for (var i = 1; i <= 9; i++) {
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
  }

  Resto = (Soma * 10) % 11;

  if (Resto === 10 || Resto === 11) Resto = 0;

  if (Resto !== parseInt(strCPF.substring(9, 10))) return false;

  Soma = 0;

  for (var i = 1; i <= 10; i++) {
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
  }

  Resto = (Soma * 10) % 11;

  if (Resto === 10 || Resto === 11) Resto = 0;

  if (Resto !== parseInt(strCPF.substring(10, 11))) return false;

  return true;
}

function validaChavePix(chave) {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(chave);
  const isPhone = /^\+[1-9][0-9]{1,14}$/.test(chave);
  const isCNPJ = /^[0-9]{14}$/.test(chave);
  const isCPF = /^[0-9]{11}$/.test(chave);

  if (isEmail) return 'E-mail';
  if (isPhone) return 'Telefone';
  if (isCNPJ) return 'CNPJ';
  if (isCPF && validaCPF(chave)) return 'CPF';

  return 'Chave Pix Inválida';
}

const PixPaymentPage = () => {
  const [pixKey, setPixKey] = useState('');
  const [amount, setAmount] = useState('');
  const [merchantCity, setMerchantCity] = useState('');
  const [description, setDescription] = useState('');
  const [qrCode, setQRCode] = useState('');
  const [brCode, setBRCode] = useState('');

  const handleGenerateQRCode = () => {
    if (pixKey && amount && merchantCity && validaCPF(pixKey)) {
      const pix = createStaticPix({
        merchantName: 'Nome do Comerciante',
        merchantCity: merchantCity,
        pixKey: pixKey,
        infoAdicional: description,
        transactionAmount: parseFloat(amount),
      });

      if (!hasError(pix)) {
        const brCode = pix.toBRCode();
        setQRCode(brCode);
        setBRCode(brCode);
      } else {
        alert('Não foi possível gerar o QR code. Verifique os dados inseridos.');
      }
    } else if (!validaCPF(pixKey)) {
      alert('A Chave Pix inserida é inválida.');
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  };

  const handleShowBRCode = () => {
    if (brCode) {
      alert(brCode);
    } else {
      alert('Ainda não há um BRCode gerado. Clique em "Gerar QR Code" primeiro.');
    }
  };

  const handleChavePixChange = (e) => {
    setPixKey(e.target.value);
    const chavePixType = validaChavePix(e.target.value);
    console.log(`Tipo de Chave Pix: ${chavePixType}`);
  };

  const styles = {
    formContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f0f0',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      fontSize: '1rem',
      border: '1px solid #ccc',
      borderRadius: '4px',
      outline: 'none',
    },
    button: {
      backgroundColor: '#ff8000',
      color: '#ffffff',
      fontSize: '1rem',
      padding: '0.75rem 1rem',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    buttonHover: {
      backgroundColor: '#ff9900',
    },
    qrCodeContainer: {
      backgroundColor: '#ffffff',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px',
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.formContainer}>
      <div style={styles.formContainer}>
        <div className="input-container">
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Chave PIX:
            <input
              type="text"
              value={pixKey}
              onChange={handleChavePixChange}
              placeholder="Chave PIX"
              style={styles.input}
            />
          </label>
        </div>
        <div className="input-container">
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Valor:
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Valor"
              style={styles.input}
            />
          </label>
        </div>
        <div className="input-container">
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Cidade:
            <input
              type="text"
              value={merchantCity}
              onChange={(e) => setMerchantCity(e.target.value)}
              placeholder="Cidade do Comerciante"
              style={styles.input}
            />
          </label>
        </div>
        <div className="input-container">
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Descrição (opcional):
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição (opcional)"
              style={styles.input}
            />
          </label>
        </div>
        <div className="button-container">
          <button style={styles.button} onClick={handleGenerateQRCode}>
            Gerar QR Code
          </button>
          <button style={styles.button} onClick={handleShowBRCode}>
            Copia e Cola 
          </button>
        </div>
      </div>
      <div style={styles.qrCodeContainer}>
        {qrCode && <QRCode value={qrCode} size={256} style={{ marginBottom: '1.5rem' }} />}
      </div>
    </div>
  );
};

export default PixPaymentPage;
