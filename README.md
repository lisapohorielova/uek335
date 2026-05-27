# BookDetailsChecker

## Voraussetzungen

Folgende Software wird vorausgesetzt und muss bereits auf dem Gerät installiert sein:

- Node.js (aktuelle LTS-Version)
- Yarn
- Visual Studio Code
- Android Studio mit konfiguriertem AVD oder Xcode mit iOS-Simulator
- Git
- Expo
- Docker
- Docker Container gepulled

---

## Projekt einrichten

### 1. Repository klonen

Das Projekt wird über Git vom Repository heruntergeladen:

```bash
git clone [Repository-URL]
```

### 2. In das Projektverzeichnis wechseln

```bash
cd BookDetailsChecker
```

### 3. Abhängigkeiten installieren

Alle benötigten Pakete werden mit Yarn installiert:

```bash
yarn install
```

---

## Projekt starten

### 4. Entwicklungsserver starten

```bash
yarn expo start
```

### 5. App auf dem Emulator öffnen

Nach dem Start des Servers im Terminal die gewünschte Plattform auswählen:

- `a` → App auf Android-Emulator öffnen
- `i` → App auf iOS-Simulator öffnen *(nur macOS)*
