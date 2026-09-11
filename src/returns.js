// Returns handling for OrderDesk.
//
// A return covers one or more lines of an order. A refund against it must be
// approved by a refunds clerk before any money moves.

/**
 * Open a return request against an order.
 *
 * @param {object} order  the order being returned against
 * @param {Array}  lines  the order lines the customer is sending back
 * @returns {object} the new return request
 */
function openReturn(order, lines) {
  if (lines.length === 0) {
    throw new Error('a return must cover at least one line');
  }

  // Ví dụ logic kiểm tra 30 ngày trong hàm openReturn
  if (order.deliveredAt) {
    const deliveredDate = new Date(order.deliveredAt);
    const now = new Date(); // hoặc ngày mở trả hàng
    const diffInDays = (now - deliveredDate) / (1000 * 60 * 60 * 24);

  if (diffInDays > 30) {
    throw new Error('Cannot open return after 30 days of delivery');
  }
}

  return {
    orderId: order.id,
    lines,
    raisedAt: new Date().toISOString(),
    approvedBy: null,
    approvedAt: null,
  };
}

function approve(returnRequest, clerkId, reason) {
  // Kiểm tra lý do bắt buộc và không được chuỗi rông/khoảng trắng
  if (!reason || typeof reason !== 'string' || reason.trim() === '') {
    throw new Error('a refund approval must carry a reason');
  }

  //Kiểm tra từ chối phê duyệt lại đơn đã được duyệt trước đó
  if (returnRequest.approvedBy != null) {
    throw new Error('this return request has already been approved');
  }

  return {
    ...returnRequest,
    approvedBy: clerkId,
    approvedAt: new Date().toISOString(),
    reason,
  };
}

module.exports = { openReturn, approve };
