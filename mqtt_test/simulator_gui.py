import tkinter as tk
from tkinter import ttk, scrolledtext
import paho.mqtt.client as mqtt
import json
import random
import time
import threading

BROKER = "test.mosquitto.org"
PORT = 1883
TOPIC_BASE = "unsapark"
PUERTA_ID = "Puerta_Ingenierias"

PLACAS_VALIDAS = [f"ABC-{i}" for i in range(100, 150)]

class ParkingSimulatorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("🚗 UNSAPark - Simulador LPR")
        self.root.geometry("600x500")
        self.root.configure(bg="#f0f0f0")

        self.client = mqtt.Client()
        self.is_connected = False
        self.auto_mode = False
        self.auto_thread = None

        self.create_widgets()
        
        self.start_mqtt()

    def create_widgets(self):
        title_label = tk.Label(self.root, text="Control de Simulación de Acceso", font=("Arial", 16, "bold"), bg="#f0f0f0")
        title_label.pack(pady=10)

        self.status_label = tk.Label(self.root, text="Estado: Desconectado 🔴", font=("Arial", 10), bg="#f0f0f0", fg="red")
        self.status_label.pack(pady=5)

        manual_frame = tk.LabelFrame(self.root, text=" Control Manual ", font=("Arial", 12), bg="white", padx=10, pady=10)
        manual_frame.pack(fill="x", padx=20, pady=10)

        tk.Label(manual_frame, text="Placa:", bg="white").grid(row=0, column=0, padx=5)
        
        self.placa_entry = tk.Entry(manual_frame, font=("Arial", 12), width=10)
        self.placa_entry.insert(0, "ABC-100")
        self.placa_entry.grid(row=0, column=1, padx=5)

        btn_entry = tk.Button(manual_frame, text="ENTRADA ⬆️", bg="#4CAF50", fg="white", font=("Arial", 10, "bold"),
                              command=lambda: self.send_manual("entrada"))
        btn_entry.grid(row=0, column=2, padx=10)

        btn_exit = tk.Button(manual_frame, text="SALIDA ⬇️", bg="#F44336", fg="white", font=("Arial", 10, "bold"),
                             command=lambda: self.send_manual("salida"))
        btn_exit.grid(row=0, column=3, padx=10)

        auto_frame = tk.LabelFrame(self.root, text=" Modo Automático (Tráfico) ", font=("Arial", 12), bg="white", padx=10, pady=10)
        auto_frame.pack(fill="x", padx=20, pady=10)

        self.btn_auto = tk.Button(auto_frame, text="▶ INICIAR SIMULACIÓN", bg="#2196F3", fg="white", font=("Arial", 10, "bold"),
                                  command=self.toggle_auto_mode)
        self.btn_auto.pack()

        log_frame = tk.LabelFrame(self.root, text=" Log de Eventos ", font=("Arial", 12), bg="#f0f0f0")
        log_frame.pack(fill="both", expand=True, padx=20, pady=10)

        self.log_area = scrolledtext.ScrolledText(log_frame, height=10, font=("Consolas", 9))
        self.log_area.pack(fill="both", expand=True)

    def log(self, message):
        timestamp = time.strftime("%H:%M:%S")
        self.log_area.insert(tk.END, f"[{timestamp}] {message}\n")
        self.log_area.see(tk.END) 

    def start_mqtt(self):
        try:
            self.client.on_connect = self.on_connect
            self.client.connect(BROKER, PORT, 60)
            self.client.loop_start()
        except Exception as e:
            self.log(f"Error conectando MQTT: {e}")

    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            self.is_connected = True
            self.status_label.config(text="Estado: Conectado 🟢", fg="green")
            self.log("Conectado al Broker MQTT")
        else:
            self.log(f"Fallo conexión código: {rc}")

    def publish_event(self, placa, tipo):
        if not self.is_connected:
            self.log("⚠️ No hay conexión MQTT")
            return

        topic = f"{TOPIC_BASE}/{PUERTA_ID}/{tipo}"
        payload = json.dumps({"placa": placa})
        
        self.client.publish(topic, payload)
        self.log(f"📡 ENVIADO: {placa} -> {tipo.upper()}")

    def send_manual(self, tipo):
        placa = self.placa_entry.get().upper()
        if not placa:
            self.log("⚠️ Escribe una placa primero")
            return
        self.publish_event(placa, tipo)

    def toggle_auto_mode(self):
        if not self.auto_mode:
            self.auto_mode = True
            self.btn_auto.config(text="⏹ DETENER SIMULACIÓN", bg="#FF9800")
            self.auto_thread = threading.Thread(target=self.run_auto_simulation)
            self.auto_thread.daemon = True 
            self.auto_thread.start()
            self.log("⚡ Modo Automático ACTIVADO")
        else:
            self.auto_mode = False
            self.btn_auto.config(text="▶ INICIAR SIMULACIÓN", bg="#2196F3")
            self.log("🛑 Modo Automático DETENIDO")

    def run_auto_simulation(self):
        while self.auto_mode:
            placa = random.choice(PLACAS_VALIDAS)
            accion = "entrada" if random.random() > 0.5 else "salida"
            
            self.publish_event(placa, accion)
            
            time.sleep(random.randint(2, 4))

if __name__ == "__main__":
    root = tk.Tk()
    app = ParkingSimulatorApp(root)
    root.mainloop()