. "./lib/get_os"
. "./lib/get_paths_like"
. "./lib/get_path"

function run_command () {
  local command=$1
  shift

  case "$command" in
    -l | --get-pathlike )
      echo "$(get_paths_like $1 $2)"
      return 0
    ;;
    -p | --get-path )
      echo "$(get_path $@)"
      return 0
    ;;
    * )
      echo "Unknown command \"$command\""
      return 1
    ;;
  esac
}

run_command "$@"
exit