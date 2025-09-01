import { Component, ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean; error?: Error | unknown; info?: unknown; copied?: boolean };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(_error: unknown) {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error("ErrorBoundary caught", error, info);
    this.setState({ error, info });
  }

  reload = () => {
    window.location.reload();
  };

  copyDiagnostics = () => {
    const err = this.state.error as Error | undefined;
    const payload = {
      message: err?.message || String(this.state.error),
      stack: err?.stack,
      info: this.state.info,
      url: window.location.href,
      userAgent: navigator.userAgent,
      time: new Date().toISOString(),
      build: import.meta.env?.VITE_BUILD_ID || 'dev'
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).then(()=> this.setState({ copied: true })).catch(()=>{});
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 max-w-xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-bold">Something went wrong</h2>
          <p className="text-muted-foreground text-sm">An unexpected error occurred. You can try reloading the page. If the problem persists, send us the diagnostics.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={this.reload} className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium shadow hover:opacity-90">Reload</button>
            <button onClick={()=> window.location.href = '/'} className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm">Home</button>
            <button onClick={this.copyDiagnostics} className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm">{this.state.copied? 'Copied!' : 'Copy diagnostics'}</button>
          </div>
          {this.state.error && (
            <details className="mt-4 text-left max-h-60 overflow-auto bg-muted/40 border rounded p-3 text-xs leading-relaxed">
              <summary className="cursor-pointer mb-2 font-semibold">Technical details</summary>
              <pre className="whitespace-pre-wrap break-words">{(this.state.error as Error | undefined)?.stack || String(this.state.error)}</pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
