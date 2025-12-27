# ChatDB | AI-Powered Natural Language to SQL Interface

**ChatDB** is a cross-platform desktop application developed as a diploma project at **HTL Wien West**. It enables users to interact with **PostgreSQL** databases using natural language by translating human input into optimized SQL queries via the **OpenAI (ChatGPT) API**.

## 🚀 Key Features
* **AI-to-SQL Translation:** Real-time generation of SQL statements from plain language using GPT models.
* **Database Management:** Direct execution of queries against a PostgreSQL backend.
* **Data Visualization:** Interactive result presentation using **Chart.js**.
* **Cross-Platform:** Built with **Electron** for Windows, macOS, and Linux support.

## 🛠 Tech Stack
* **Frontend:** Vue 3, Quasar Framework, Pinia (State Management)
* **Backend/Desktop:** Electron, Node.js
* **Database:** PostgreSQL (pg-library)
* **AI:** OpenAI API
* **Build Tool:** Vite

## 📈 Evolution & Lessons Learned
This project was a major milestone in my transition from a technical student to a software engineer. Working in a team of four, I learned the importance of structured collaboration and version control.

**Reflections from my current perspective (CS Student at TU Wien):**
* **Code Efficiency:** While functional, I now recognize areas where the asynchronous handling and state management could be more streamlined.
* **Scalability:** Today, I would implement a more modular architecture to better separate the AI translation layer from the database execution logic.
* **Testing:** If I were to rebuild this today, I would increase the test coverage using the Mocha/Chai setup already present in the repository.

---

## 💻 Development Setup

### Install the dependencies
```bash
npm install


### Start the app in development mode

```bash
quasar dev -m electron
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
