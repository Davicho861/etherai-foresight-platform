#!/bin/bash

# Guardián de Recursos: Monitor de Uso de Railway
# Alerta cuando el uso mensual supera el 80% de $5

EMAIL="davidoperator421@outlook.com"
THRESHOLD=4.00  # $4 = 80% de $5
SERVICE_NAME="praevisio-backend"

echo "[Guardián] Verificando uso de Railway..."

# Obtener uso actual (asumiendo railway CLI instalado y autenticado)
USAGE_JSON=$(railway usage --service $SERVICE_NAME --json 2>/dev/null)

if [ $? -ne 0 ]; then
    echo "[Guardián] Error: No se pudo obtener el uso de Railway. Verifica autenticación."
    exit 1
fi

# Parsear el JSON para obtener el costo total
# Asumiendo formato: {"total": 2.50, "services": [...]}
TOTAL_COST=$(echo $USAGE_JSON | jq -r '.total // 0')

if [ -z "$TOTAL_COST" ] || [ "$TOTAL_COST" == "null" ]; then
    echo "[Guardián] Error: No se pudo parsear el costo total."
    exit 1
fi

echo "[Guardián] Uso actual: $${TOTAL_COST}"

# Comparar con umbral
if (( $(echo "$TOTAL_COST > $THRESHOLD" | bc -l) )); then
    echo "[Guardián] ALERTA: Uso supera el 80% ($${TOTAL_COST} > $${THRESHOLD})"

    # Enviar alerta por email usando sendmail (asumiendo instalado)
    SUBJECT="ALERTA: Uso de Railway supera 80% - Praevisio AI"
    BODY="El uso mensual de Railway ha alcanzado $${TOTAL_COST}, superando el umbral de $${THRESHOLD} (80% de \$5).

Acciones recomendadas:
- Revisar logs de Railway
- Optimizar recursos
- Considerar upgrade si es necesario

Guardián de Recursos - Hefesto"

    echo -e "Subject: $SUBJECT\n\n$BODY" | sendmail $EMAIL

    if [ $? -eq 0 ]; then
        echo "[Guardián] Alerta enviada a $EMAIL"
    else
        echo "[Guardián] Error: No se pudo enviar la alerta por email"
    fi
else
    echo "[Guardián] Uso dentro de límites seguros ($${TOTAL_COST} < $${THRESHOLD})"
fi

echo "[Guardián] Monitoreo completado."