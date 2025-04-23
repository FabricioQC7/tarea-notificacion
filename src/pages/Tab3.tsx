import {
  IonButton, IonInput, IonLabel, IonTextarea, IonItem, IonList, IonToast,
  IonSelect, IonSelectOption, IonContent, IonHeader, IonPage, IonTitle,
  IonToolbar, IonText
} from '@ionic/react';
import { useEffect, useState } from 'react';
import './Tab3.css';
import { fetchAllDeviceTokens } from '../Services/firebase/obtenerTokens/tokens'; 
import axios from 'axios';

const Tab3: React.FC = () => {
  const [tokens, setTokens] = useState<string[]>([]);
  const [token, setToken] = useState<string>('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [data, setData] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [response, setResponse] = useState('');

  useEffect(() => {
    const obtenerTokens = async () => {
      const listaTokens = await fetchAllDeviceTokens();
      setTokens(listaTokens);
    };

    obtenerTokens();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const parsedData = data ? JSON.parse(data) : {};
      const payload = { token, title, body, data: parsedData };

      const res = await axios.post("http://192.168.0.22:3000/api/send-notification", payload);
      setResponse(JSON.stringify(res.data, null, 2));
      setShowToast(true);
    } catch (error: any) {
      setResponse(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Envio de notificaciones</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <form onSubmit={handleSubmit}>
          <IonList>
            <IonItem>
              <IonLabel position="stacked">Selecciona un Token</IonLabel>
              <IonSelect
                placeholder="Tokens disponibles"
                value={token}
                onIonChange={(e) => setToken(e.detail.value)}
                required
              >
                {tokens.map((tok, index) => (
                  <IonSelectOption key={index} value={tok}>
                    {tok}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Título</IonLabel>
              <IonInput
                required
                type="text"
                placeholder="Título de la notificación"
                value={title}
                onIonChange={(e) => setTitle(e.detail.value!)}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Mensaje</IonLabel>
              <IonTextarea
                required
                placeholder="Cuerpo del mensaje"
                value={body}
                onIonChange={(e) => setBody(e.detail.value!)}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Datos adicionales (JSON - opcional)</IonLabel>
              <IonTextarea
                placeholder='{"key1": "value1", "key2": "value2"}'
                value={data}
                onIonChange={(e) => setData(e.detail.value!)}
              />
            </IonItem>
          </IonList>

          <IonButton expand="block" type="submit" className="ion-margin-top" disabled={!token}>
            Enviar Notificación
          </IonButton>
        </form>

        {response && (
          <IonText color="primary">
            <pre style={{ whiteSpace: 'pre-wrap' }}>{response}</pre>
          </IonText>
        )}

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Notificación enviada"
          duration={2000}
          color="success"
        />
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
