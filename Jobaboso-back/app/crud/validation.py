from fastapi import HTTPException, status

def validate_pagination_params(page: int, page_size: int):
    if page < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="페이지는 1 이상이어야 합니다."
        )
    
    if page_size < 1 or page_size > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="페이지 크기는 1-100 사이여야 합니다."
        )