# Escritura en Tiempo Real

Una plataforma que permite a los escritores compartir su proceso creativo en tiempo real con sus lectores. Los lectores pueden ver cómo se forma el texto letra por letra, experimentando el proceso de escritura en vivo.

## Características

- 📝 Modo Escritor: Interfaz limpia y simple para escribir sin distracciones
- 👀 Modo Lector: Visualización en tiempo real del proceso de escritura
- ⚡ Actualizaciones instantáneas usando AWS AppSync
- 🎨 Animaciones suaves de escritura
- 🌓 Modo claro/oscuro
- 📱 Diseño responsivo

## Tecnologías

- Next.js 14
- TypeScript
- Tailwind CSS
- AWS Amplify
- AWS AppSync
- GraphQL

## Configuración Local

1. Clona el repositorio:

```bash
git clone [URL_DEL_REPOSITORIO]
cd escritura-en-tiempo-real
```

2. Instala las dependencias:

```bash
npm install
```

3. Configura las variables de entorno:
   Crea un archivo `.env.local` con las siguientes variables:

```
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_APPSYNC_ENDPOINT=your-appsync-endpoint
NEXT_PUBLIC_APPSYNC_API_KEY=your-api-key
```

4. Inicia el servidor de desarrollo:

```bash
npm run dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
src/
  ├── app/                    # Páginas de la aplicación
  │   ├── page.tsx           # Página principal
  │   ├── writer/            # Modo escritor
  │   └── reader/            # Modo lector
  ├── components/            # Componentes React
  │   ├── Editor.tsx        # Componente de edición
  │   └── Viewer.tsx        # Componente de visualización
  ├── graphql/              # Esquemas y operaciones GraphQL
  └── aws-exports.ts        # Configuración de AWS
```

## Despliegue

El proyecto está configurado para ser desplegado en AWS Amplify. Sigue estos pasos:

1. Configura tu cuenta de AWS y el CLI de Amplify
2. Inicializa Amplify en el proyecto
3. Configura AppSync y las variables de entorno
4. Despliega usando el comando `amplify push`

## Licencia

MIT
