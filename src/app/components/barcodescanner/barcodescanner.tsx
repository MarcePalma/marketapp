import React, { useRef, useEffect, useState } from 'react';
import Quagga from 'quagga';

interface BarcodeScannerProps {
    onScan: (code: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const [quaggaReady, setQuaggaReady] = useState<boolean>(false);
    const [scanCooldown, setScanCooldown] = useState<boolean>(false);
    const [scannedCodes, setScannedCodes] = useState<Set<string>>(new Set());

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
                        setQuaggaReady(true);
                        Quagga.onDetected((data: QuaggaJSResultObject) => {
                            if (data && data.codeResult && data.codeResult.code && !scanCooldown) {
                                onScan(data.codeResult.code);
                                setScanCooldown(true);
                                setTimeout(() => {
                                    setScanCooldown(false);
                                }, 1000); // 1000 milliseconds (1 second) cooldown
                            }
                        });
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
                    const scannedCode = data.codeResult.code;
                    if (!scannedCodes.has(scannedCode)) {
                        onScan(scannedCode);
                        setScannedCodes(prevCodes => new Set(prevCodes.add(scannedCode)));
                    }
                }
            });
        }
    }, [onScan, quaggaReady, scannedCodes]);

    const handleScanToggle = () => {
        if (Quagga) {
            if (isScanning) {
                Quagga.stop();
            } else {
                Quagga.start();
            }
            setIsScanning(!isScanning);
        } else {
            console.error('Quagga is not defined.');
        }
    };

    return (
        <div>
            <video ref={videoRef} autoPlay muted playsInline />
            <button onClick={handleScanToggle} className='text-white font-semibold bg-red-400 rounded-md'>
                {isScanning ? 'Detener Escaneo' : 'Iniciar Escaneo'}
            </button>
        </div>
    );
};

export default BarcodeScanner;
