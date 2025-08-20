import { Component, ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error("ErrorBoundary caught", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">Please try refreshing the page.</p>
          <button
            className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm"
            onClick={() => (window.location.href = "/")}
          >
            Go Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
