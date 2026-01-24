// src/components/Loader.tsx
import React, {
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import Loading from "../../Loading/Loading.tsx";

type AnyComponent<P> = ComponentType<P> | LazyExoticComponent<ComponentType<P>>;

export default function Loader<P extends object>(
  Component: AnyComponent<P>
): ComponentType<P> {
  const Wrapped: React.FC<P> = (props) => {
    const C = Component as unknown as ComponentType<P>;
    return (
      <Suspense fallback={<Loading />}>
        <C {...props} />
      </Suspense>
    );
  };

  Wrapped.displayName = `Loader(${(Component as any).displayName || (Component as any).name || "Component"})`;
  return Wrapped;
}
