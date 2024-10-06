import React, { useState, useEffect } from 'react';
import { useQRCodeGenerator } from './hooks/useQRCodeGenerator';
import styled from 'styled-components';
import Lottie from 'lottie-react';
import animationData from './assets/QR.json';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: ${(props) => (props.isDarkMode ? '#121212' : '#ffffff')};
  color: ${(props) => (props.isDarkMode ? '#ffffff' : '#01056F')};
`;

const TitleContainer = styled.div`
  position: center;
  display: inline-block;
`;

const StyledH1 = styled.h1`
  font-size: 2.5rem;
  position: relative;
  z-index: 2;
  color: inherit;
`;

const StyledH2 = styled.h2`
  font-size: 2rem;
  color: inherit;
`;

const LottieContainer = styled.div`
  margin-bottom: -30px;
  width: 250px;
  height: 250px;
  border: outset;
  border-width: 1px;
  color: inherit;
`;

const QRCodeImage = styled.img`
  display: block;
  margin: auto;
  margin: 20px;
`;

const ModalBackdrop = styled.div`
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 8px;
  font-size: 14px;
`;

const StyledButton = styled.button`
  background-color: ${(props) => (props.isDarkMode ? '#ffffff' : '#01056F')};
  color: ${(props) => (props.isDarkMode ? '#01056F' : '#ffffff')};
  padding: 10px 20px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin: 8px 10px;
  cursor: pointer;
  border-radius: 30px;
  transition-duration: 0.4s;
`;

const ToggleButton = styled(StyledButton)`
  margin-top: 20px;
  margin-bottom: 20px;
`;

const App = () => {
  const { url, setUrl, qrCode, showInput, generateQRCode, resetQRCode } = useQRCodeGenerator();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? '#121212' : '#ffffff';
  }, [isDarkMode]);

  const handleGenerate = (e) => {
    e.preventDefault();
    const validUrlRegex = /^(https?:\/\/(www\.)?|www\.)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;

    if (validUrlRegex.test(url)) {
      generateQRCode(url);
      setErrorMessage(''); 
    } else {
      setErrorMessage('Please enter a valid url starting with http, https or www.');
    }
  };

  const handleDownload = () => {
    if (!fileName) {
      setIsModalOpen(true);
      return;
    }

    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `${fileName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    resetQRCode();
    setFileName('');
    setIsModalOpen(false);
  };

  const handleReset = () => {
    resetQRCode();
  };

  const closeModal = () => setIsModalOpen(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <AppContainer isDarkMode={isDarkMode}>
      <LottieContainer>
        <Lottie loop autoplay animationData={animationData} />
      </LottieContainer>
      <TitleContainer>
        <StyledH1>QR Code Generator</StyledH1>
      </TitleContainer>

      <ToggleButton onClick={toggleDarkMode} isDarkMode={isDarkMode}>
        {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </ToggleButton>

      {showInput && (
  <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <input
      type="text"
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      placeholder="E.g. www.linkedin.com"
      required
      style={{ marginBottom: '10px', padding: '10px', width: '250px' }}  // Adjust padding and width as needed
    />
    <StyledButton type="submit" isDarkMode={isDarkMode}>
      Generate QR Code
    </StyledButton>
    {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
  </form>
)}

      {qrCode && (
        <>
          <QRCodeImage src={qrCode} alt="Generated QR Code" />
          <div>
            <StyledButton onClick={handleDownload} isDarkMode={isDarkMode}>
              Download QR Code
            </StyledButton>
            <StyledButton onClick={handleReset} isDarkMode={isDarkMode}>
              Reset
            </StyledButton>
          </div>
        </>
      )}

      {isModalOpen && (
        <ModalBackdrop>
          <ModalContent>
            <StyledH2>Enter a file name for your QR Code</StyledH2>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
              placeholder="E.g. Linkedin_qrcode"
            />
            <StyledButton onClick={handleDownload}>Download</StyledButton>
            <StyledButton onClick={closeModal}>Cancel</StyledButton>
          </ModalContent>
        </ModalBackdrop>
      )}
    </AppContainer>
  );
};

export default App;
