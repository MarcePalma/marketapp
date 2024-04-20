import React, { useRef, useEffect, useState } from 'react';
import Quagga from 'quagga';

interface BarcodeScannerProps {
    onScan: (code: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const [quaggaReady, setQuaggaReady] = useState<boolean>(false);

    useEffect(() => {
        const startScanner = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    Quagga.init({
                        inputStream: {
                            name: 'Live',
                            type: 'LiveStream',
                            target: videoRef.current,
                        },
                        decoder: {
                            readers: ['ean_reader'],
                        },
                    }, (err: any) => {
                        if (err) {
                            console.error('Error al inicializar Quagga:', err);
                            return;
                        }
                        setQuaggaReady(true); // Marcar Quagga como listo
                    });
                }
            } catch (err) {
                console.error('Error al acceder a la cámara:', err);
            }
        };

        startScanner();

        return () => {
            try {
                if (Quagga && typeof Quagga.stop === 'function') {
                    Quagga.stop();
                }
            } catch (error) {
                console.error('Error al detener Quagga:', error);
            }
            setIsScanning(false);
        };
    }, []);

    useEffect(() => {
        if (quaggaReady) {
            Quagga.onDetected((data: QuaggaJSResultObject) => {
                if (data && data.codeResult && data.codeResult.code) {
                    onScan(data.codeResult.code);
                }
            });
        }
    }, [onScan, quaggaReady]);

    const handleScanToggle = () => {
        if (quaggaReady) {
            if (isScanning) {
                Quagga.stop();
            } else {
                Quagga.start();
            }
            setIsScanning(!isScanning);
        }
    };

    return (
        <div>
            <video ref={videoRef} autoPlay muted playsInline />
            <button onClick={handleScanToggle}>
                {isScanning ? 'Detener Escaneo' : 'Iniciar Escaneo'}
            </button>
        </div>
    );
};

export default BarcodeScanner;
