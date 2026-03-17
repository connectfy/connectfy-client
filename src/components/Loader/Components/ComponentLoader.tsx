import React, {
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import { SettingsSpinner } from "@/components/Spinner/Settings/SettingsSpinner.tsx";

type AnyComponent<P> = ComponentType<P> | LazyExoticComponent<ComponentType<P>>;

export default function ComponentLoader<P extends object>(
  Component: AnyComponent<P>,
  FallbackComponent: React.ReactNode = <SettingsSpinner />,
): ComponentType<P> {
  const Wrapped: React.FC<P> = (props) => {
    const C = Component as unknown as ComponentType<P>;
    return (
      <Suspense fallback={FallbackComponent}>
        <C {...props} />
      </Suspense>
    );
  };

  Wrapped.displayName = `ComponentLoader(${(Component as any).displayName || (Component as any).name || "Component"})`;
  return Wrapped;
}
