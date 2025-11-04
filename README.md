# 📝 Proyecto Final - Aplicación de Notas

Una aplicación web de notas personales desarrollada con React, Vite, Material-UI, Tailwind CSS y Firebase.

## 🚀 Características

- ✅ Autenticación de usuarios con Firebase Auth
- ✅ Registro e inicio de sesión
- ✅ CRUD completo de notas (Crear, Leer, Actualizar, Eliminar)
- ✅ Notas privadas por usuario
- ✅ Interfaz moderna con Material-UI
- ✅ Responsive design
- ✅ Despliegue automático a GitHub Pages

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: Material-UI (MUI)
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication + Firestore)
- **Deployment**: GitHub Pages

## 📋 Configuración Inicial

### 1. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita Authentication con Email/Password
4. Crea una base de datos Firestore
5. Configura las reglas de Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Los usuarios solo pueden acceder a sus propias notas
    match /notes/{noteId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

6. Obtén tu configuración de Firebase y actualiza el archivo `src/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-project-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 2. Configurar el Dominio

Si quieres que la aplicación esté en `danny-palma.github.io/proyecto-final-basededatos-ecci`:

1. Asegúrate de que el repositorio se llame `proyecto-final-basededatos-ecci`
2. El usuario de GitHub debe ser `danny-palma`
3. Habilita GitHub Pages en la configuración del repositorio (Source: GitHub Actions)

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- Node.js 18 o superior
- npm

### Pasos de instalación

1. Clona el repositorio:
```bash
git clone https://github.com/danny-palma/proyecto-final-basededatos-ecci.git
cd proyecto-final-basededatos-ecci
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura Firebase (ver sección anterior)

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

5. Abre tu navegador en `http://localhost:5173`

## 📦 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción localmente
- `npm run lint` - Ejecuta el linter

## 🏗️ Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── Login.tsx        # Componente de autenticación
│   └── NotesApp.tsx     # Aplicación principal de notas
├── contexts/            # Contextos de React
│   └── AuthContext.tsx  # Contexto de autenticación
├── types/               # Definiciones de tipos TypeScript
│   └── index.ts         # Tipos principales
├── firebase.ts          # Configuración de Firebase
├── App.tsx             # Componente principal
├── main.tsx            # Punto de entrada
└── index.css           # Estilos globales
```

## 🔒 Seguridad

- Las notas están protegidas a nivel de base de datos
- Solo los usuarios autenticados pueden acceder
- Cada usuario solo puede ver sus propias notas
- Las reglas de Firestore garantizan la seguridad

## 🌐 Despliegue

El proyecto se despliega automáticamente a GitHub Pages cuando se hace push a la rama `main`. La URL será:

`https://danny-palma.github.io/proyecto-final-basededatos-ecci/`

## 📝 Funcionalidades

### Autenticación
- Registro de nuevos usuarios
- Inicio de sesión
- Cierre de sesión
- Validación de formularios

### Gestión de Notas
- Crear nuevas notas
- Editar notas existentes
- Eliminar notas
- Visualización en tiempo real
- Búsqueda y filtrado

## 🎨 UI/UX

- Diseño moderno y minimalista
- Interfaz responsive para móviles y desktop
- Tema coherente con Material-UI
- Iconos y animaciones fluidas
- Feedback visual para todas las acciones

## 🔧 Personalización

Para personalizar la aplicación:

1. **Colores**: Modifica el tema en `src/App.tsx`
2. **Estilos**: Usa las clases de Tailwind CSS
3. **Componentes**: Personaliza los componentes de Material-UI

## 📄 Licencia

Este proyecto es de uso académico para el curso de Base de Datos de ECCI.

## 👨‍💻 Autor

- **Daniel Palma** - [danny-palma](https://github.com/danny-palma)
