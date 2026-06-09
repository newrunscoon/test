#!/bin/bash
# stdin의 JSON을 타임스탬프와 함께 프로젝트 로그파일에 기록한다.
json_input=$(cat)
timestamp=$(date '+%Y-%m-%d %H:%M:%S')
log_file=".cursor/hooks/audit.log"

mkdir -p "$(dirname "$log_file")"
echo "[$timestamp] $json_input" >> "$log_file"

exit 0
