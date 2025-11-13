import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorCount: 0,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary capturou um erro:", error);
    console.error("Detalhes do erro:", errorInfo);

    // Incrementar contador de erros
    this.setState((prevState) => ({
      errorCount: prevState.errorCount + 1,
    }));

    // Se houver muitos erros consecutivos (mais de 3), pode indicar um problema sério
    if (this.state.errorCount > 3) {
      console.error(
        "AVISO: Múltiplos erros detectados. Pode haver um problema de dados corrompidos.",
      );
      // Em vez de limpar tudo, apenas registra o problema
      // O usuário pode decidir limpar dados manualmente
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorCount: 0,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>⚠️</Text>
          <Text style={styles.title}>Ops! Algo deu errado</Text>
          <Text style={styles.message}>
            Ocorreu um erro inesperado. Tente novamente.
          </Text>

          {this.state.error && __DEV__ && (
            <View style={styles.errorDetails}>
              <Text style={styles.errorText}>
                {this.state.error.toString()}
              </Text>
            </View>
          )}

          {this.state.errorCount > 2 && (
            <Text style={styles.warning}>
              Se o problema persistir, tente limpar os dados do app nas
              configurações.
            </Text>
          )}

          <TouchableOpacity style={styles.button} onPress={this.handleReset}>
            <Text style={styles.buttonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
    paddingHorizontal: 20,
  },
  warning: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: "#ff6b6b",
    paddingHorizontal: 20,
    fontStyle: "italic",
  },
  errorDetails: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    maxWidth: "90%",
  },
  errorText: {
    fontSize: 12,
    color: "#dc3545",
    fontFamily: "monospace",
  },
  button: {
    backgroundColor: "#FF9100",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
