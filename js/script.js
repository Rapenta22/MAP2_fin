$(document).ready(function () {
  let userMoney = 999999999; // 초기 자금
  let cartTotal = 0; // 장바구니 총합

  // 초기 상태에서 모달을 숨김
  $("#modal").hide();

  // 돈 정보 표시 추가
  $("<div id='money-display' class='money-display'>돈: " + userMoney.toLocaleString() + "</div>").appendTo(".title");

  // 장바구니에 아이템 추가 함수
  function addToCart(itemName, itemPrice) {
    cartTotal += itemPrice;

    // 장바구니에 아이템 추가
    $(".cart-items").append(`
      <li>${itemName} - ₩${itemPrice.toLocaleString()}</li>
    `);

    // 총금액 업데이트
    updateCartTotal();
  }

  // 총금액 및 할인된 가격 계산
  function updateCartTotal() {
    $("#cart-total-price").text(cartTotal.toLocaleString());

    if (cartTotal > 100000000) {
      const discountedTotal = Math.floor(cartTotal * 0.8); // 20% 할인 계산
      if (!$("#discounted-total").length) {
        $("#cart-total-price").after(`<div id="discounted-total" class="discounted-total"></div>`);
      }
      $("#discounted-total").html(`20% 할인 적용: ₩${discountedTotal.toLocaleString()}`);
    } else {
      $("#discounted-total").remove(); // 1억 이하일 때 할인 표시 제거
    }
  }

  // 모달 열기
  $(".hover-group").on("click", function () {
    if ($(this).hasClass("sold-out")) {
      return; // 품절된 아이템은 클릭 불가
    }
  
    const itemName = $(this).data("item"); // 상품 이름
    const fullText = $(this).text(); // 전체 텍스트 (상품명 + 가격)
  
    // 가격 추출: ₩ 이후의 숫자만 추출
    const priceMatch = fullText.match(/₩\s?([\d,]+)/);
    let itemPrice = priceMatch ? priceMatch[1].replace(/,/g, "") : 0; // 쉼표 제거 및 숫자 변환
    itemPrice = parseInt(itemPrice, 10); // 숫자로 변환
  
    if (isNaN(itemPrice) || itemPrice <= 0) {
      alert("잘못된 가격 정보입니다."); // 잘못된 가격 처리
      return;
    }
  
    $("#modal-message").data("price", itemPrice).text(`${itemName}을(를) 구매한다`);
  
    // 버튼 항상 표시
    $(".modal-buttons").show();
  
    $("#modal").fadeIn(); // 클릭 시 모달 표시
  });
  

  // 모달 닫기
  $("#cancel-button").on("click", function () {
    $("#modal").fadeOut(); // 모달 숨기기
  });

  // 모달에서 장바구니 버튼 클릭 시
  $("#cart-button").on("click", function () {
    const itemName = $("#modal-message").text().split("을(를) 구매한다")[0].trim(); // 아이템 이름 추출
    const itemPrice = $("#modal-message").data("price");

    if (itemName && itemPrice) {
      addToCart(itemName, itemPrice);
      $("#modal").fadeOut(); // 모달 닫기
    }
  });

  // 구매 완료 버튼 동작
  $(".cart-purchase-button").on("click", function () {
    let finalTotal = cartTotal;
    if (cartTotal > 100000000) {
      finalTotal = Math.floor(cartTotal * 0.8); // 20% 할인된 총금액
    }

    if (userMoney >= finalTotal) {
      userMoney -= finalTotal;
      $("#money-display").text(`잔고: ₩${userMoney.toLocaleString()}`);
      alert("구매가 완료되었습니다!");

      // 장바구니에 있는 아이템들을 품절 처리
      $(".cart-items li").each(function () {
        const itemText = $(this).text().split(" - ")[0].trim(); // 아이템 이름 추출
        const targetItem = $(`.hover-group[data-item='${itemText}']`);
        targetItem.addClass("sold-out").text(`${itemText} (품절)`); // 품절 표시
        targetItem.off("click"); // 클릭 비활성화
      });
      if (finalTotal > 100000000) {
        // 1억 이상 구매 시 VIP 모달 표시
        $("#vip-modal").fadeIn();

        // 5초 후 모달 닫기
        setTimeout(() => {
          $("#vip-modal").fadeOut();
        }, 5000);
      }
      $(".cart-items").empty(); // 장바구니 비우기
      cartTotal = 0; // 총합 초기화
      $("#cart-total-price").text(cartTotal.toLocaleString());
      $("#discounted-total").remove(); // 할인된 총액 제거
    } else {
      alert("잔액이 부족합니다!");
    }
  });
});