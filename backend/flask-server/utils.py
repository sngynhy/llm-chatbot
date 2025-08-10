from flask import request

def is_client_connected():
    """
    클라이언트가 여전히 연결되어 있는지 확인하는 함수
    
    Returns:
        bool: 클라이언트가 연결되어 있으면 True, 그렇지 않으면 False
    """
    try:
        # Flask의 내장 연결 상태 확인 (가장 신뢰할 수 있음)
        if hasattr(request, 'is_disconnected') and request.is_disconnected:
            print("Flask 내장 속성으로 연결 해제 감지")
            return False
            
        # request.environ에서 연결 상태 확인 (더 안전한 방법)
        if 'werkzeug.socket' in request.environ:
            try:
                socket = request.environ['werkzeug.socket']
                if hasattr(socket, 'closed'):
                    is_closed = socket.closed
                    print(f"소켓 상태: {'닫힘' if is_closed else '열림'}")
                    return not is_closed
            except Exception as e:
                print(f"소켓 상태 확인 중 오류: {e}")
                # 소켓 확인 실패 시 기본적으로 연결된 것으로 간주
                pass
                
        # HTTP 헤더를 통한 연결 상태 확인 (보조적인 방법)
        if 'HTTP_CONNECTION' in request.environ:
            connection = request.environ['HTTP_CONNECTION'].lower()
            print(f"HTTP_CONNECTION 헤더: {connection}")
            if connection == 'close':
                print("HTTP_CONNECTION이 'close'로 설정됨")
                return False
                
        # 기본적으로 연결된 것으로 간주 (더 관대한 접근)
        print("클라이언트 연결 상태 확인 완료 - 연결된 것으로 간주")
        return True

    except Exception as e:
        print(f"연결 상태 확인 중 예외 발생: {e}")
        # 예외 발생 시 기본적으로 연결된 것으로 간주 (안전한 접근)
        return True