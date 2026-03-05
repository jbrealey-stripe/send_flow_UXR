import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import prototypes from './prototypes/index';
import PrototypeList from './PrototypeList';

const Prototype1App = lazy(() => import('./prototypes/prototype1/App'));

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/new-user/*" element={<Prototype1App basePath="/new-user" variant="new-user" />} />
        <Route path="/existing-user/*" element={<Prototype1App basePath="/existing-user" variant="existing-user" />} />
        <Route path="/existing-no-details/*" element={<Prototype1App basePath="/existing-no-details" variant="existing-no-details" />} />
        {prototypes.map((p) => (
          <Route
            key={p.id}
            path={`${p.id}/*`}
            element={<p.component basePath={`/${p.id}`} />}
          />
        ))}
        <Route path="/" element={<PrototypeList />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
