#include "ChaSetSquircle.h"

#include <QPainter>
#include <QtMath>
#include <algorithm>

ChaSetSquirclePen::ChaSetSquirclePen(QObject *parent)
    : QObject(parent)
{
}

void ChaSetSquirclePen::setWidth(qreal w)
{
    if (qFuzzyCompare(m_width, w))
        return;
    m_width = w;
    emit changed();
}

void ChaSetSquirclePen::setColor(const QColor &c)
{
    if (m_color == c)
        return;
    m_color = c;
    emit changed();
}

ChaSetSquircle::ChaSetSquircle(QQuickItem *parent)
    : QQuickPaintedItem(parent)
{
    setAntialiasing(true);
    setMipmap(false);
    setRenderTarget(QQuickPaintedItem::FramebufferObject);

    connect(&m_pen, &ChaSetSquirclePen::changed, this, [this]() { update(); });
}

void ChaSetSquircle::setColor(const QColor &c)
{
    if (m_color == c)
        return;
    m_color = c;
    emit colorChanged();
    update();
}

void ChaSetSquircle::setRadius(qreal r)
{
    if (qFuzzyCompare(m_radius, r))
        return;
    m_radius = r;
    emit radiusChanged();
    update();
}

void ChaSetSquircle::setTopLeftRadius(qreal r)
{
    if (qFuzzyCompare(m_topLeftRadius, r))
        return;
    m_topLeftRadius = r;
    emit topLeftRadiusChanged();
    update();
}

void ChaSetSquircle::setTopRightRadius(qreal r)
{
    if (qFuzzyCompare(m_topRightRadius, r))
        return;
    m_topRightRadius = r;
    emit topRightRadiusChanged();
    update();
}

void ChaSetSquircle::setBottomLeftRadius(qreal r)
{
    if (qFuzzyCompare(m_bottomLeftRadius, r))
        return;
    m_bottomLeftRadius = r;
    emit bottomLeftRadiusChanged();
    update();
}

void ChaSetSquircle::setBottomRightRadius(qreal r)
{
    if (qFuzzyCompare(m_bottomRightRadius, r))
        return;
    m_bottomRightRadius = r;
    emit bottomRightRadiusChanged();
    update();
}

void ChaSetSquircle::setCornerSmoothing(qreal s)
{
    if (qFuzzyCompare(m_cornerSmoothing, s))
        return;
    m_cornerSmoothing = s;
    emit cornerSmoothingChanged();
    update();
}

void ChaSetSquircle::setRoundLeft(bool v)
{
    if (m_roundLeft == v)
        return;
    m_roundLeft = v;
    emit roundLeftChanged();
    update();
}

void ChaSetSquircle::setRoundRight(bool v)
{
    if (m_roundRight == v)
        return;
    m_roundRight = v;
    emit roundRightChanged();
    update();
}

void ChaSetSquircle::setRoundTop(bool v)
{
    if (m_roundTop == v)
        return;
    m_roundTop = v;
    emit roundTopChanged();
    update();
}

void ChaSetSquircle::setRoundBottom(bool v)
{
    if (m_roundBottom == v)
        return;
    m_roundBottom = v;
    emit roundBottomChanged();
    update();
}

void ChaSetSquircle::setRoundTopLeft(bool v)
{
    if (m_roundTopLeft == v)
        return;
    m_roundTopLeft = v;
    emit roundTopLeftChanged();
    update();
}

void ChaSetSquircle::setRoundTopRight(bool v)
{
    if (m_roundTopRight == v)
        return;
    m_roundTopRight = v;
    emit roundTopRightChanged();
    update();
}

void ChaSetSquircle::setRoundBottomLeft(bool v)
{
    if (m_roundBottomLeft == v)
        return;
    m_roundBottomLeft = v;
    emit roundBottomLeftChanged();
    update();
}

void ChaSetSquircle::setRoundBottomRight(bool v)
{
    if (m_roundBottomRight == v)
        return;
    m_roundBottomRight = v;
    emit roundBottomRightChanged();
    update();
}

struct CornerMath {
    qreal p = 0.0;
    qreal a = 0.0;
    qreal b = 0.0;
    qreal c = 0.0;
    qreal d = 0.0;
    qreal theta = 0.0; // in radians
    qreal beta = 0.0;  // in radians
    qreal k = 0.0;     // arc cubic factor
    qreal r = 0.0;
};

static CornerMath calcCorner(qreal radius, qreal s, qreal shortest_l)
{
    CornerMath m;
    m.r = std::max(0.0, std::min(radius, shortest_l / 2.0));
    if (m.r <= 0.001)
        return m;

    s = std::clamp(s, 0.0, 1.0);
    m.p = std::min(shortest_l / 2.0, (1.0 + s) * m.r);

    qreal angle_beta_deg;
    qreal angle_alpha_deg;
    if (m.r > shortest_l / 4.0) {
        qreal cp = (m.r - shortest_l / 4.0) / (shortest_l / 4.0);
        angle_beta_deg = 90.0 * (1.0 - s * (1.0 - cp));
        angle_alpha_deg = 45.0 * s * (1.0 - cp);
    } else {
        angle_beta_deg = 90.0 * (1.0 - s);
        angle_alpha_deg = 45.0 * s;
    }

    qreal angle_theta_deg = (90.0 - angle_beta_deg) / 2.0;

    m.theta = qDegreesToRadians(angle_theta_deg);
    m.beta = qDegreesToRadians(angle_beta_deg);
    qreal alpha = qDegreesToRadians(angle_alpha_deg);

    qreal d_div_c = std::tan(alpha);
    qreal h_longest = m.r * std::tan(m.theta / 2.0);
    qreal l = std::sin(m.beta / 2.0) * m.r * M_SQRT2;
    m.c = h_longest * std::cos(alpha);
    m.d = m.c * d_div_c;
    m.b = ((m.p - l) - (1.0 + d_div_c) * m.c) / 3.0;
    m.a = 2.0 * m.b;
    m.k = (4.0 / 3.0) * std::tan(m.beta / 4.0);

    return m;
}

QPainterPath ChaSetSquircle::createSquirclePath(
    const QRectF &rect,
    qreal rTL, qreal rTR, qreal rBR, qreal rBL,
    qreal smoothing,
    bool tl, bool tr, bool br, bool bl)
{
    QPainterPath path;
    const qreal W = rect.width();
    const qreal H = rect.height();
    const qreal X = rect.x();
    const qreal Y = rect.y();

    if (W <= 0.0 || H <= 0.0)
        return path;

    const qreal shortest_l = std::min(W, H);

    CornerMath mTL = (tl && rTL > 0.001) ? calcCorner(rTL, smoothing, shortest_l) : CornerMath{};
    CornerMath mTR = (tr && rTR > 0.001) ? calcCorner(rTR, smoothing, shortest_l) : CornerMath{};
    CornerMath mBR = (br && rBR > 0.001) ? calcCorner(rBR, smoothing, shortest_l) : CornerMath{};
    CornerMath mBL = (bl && rBL > 0.001) ? calcCorner(rBL, smoothing, shortest_l) : CornerMath{};

    // Start at top edge center
    path.moveTo(X + W / 2.0, Y);

    // 1. Top Edge -> Top-Right Corner
    if (mTR.r <= 0.001) {
        path.lineTo(X + W, Y);
    } else {
        path.lineTo(X + W - mTR.p, Y);
        // Segment 1 (Straight -> Arc)
        path.cubicTo(
            X + W - (mTR.p - mTR.a), Y,
            X + W - (mTR.p - mTR.a - mTR.b), Y,
            X + W - (mTR.p - mTR.a - mTR.b - mTR.c), Y + mTR.d
        );
        // Segment 2 (Arc)
        qreal cp1x = (X + W - (mTR.p - mTR.a - mTR.b - mTR.c)) + mTR.k * mTR.r * std::cos(mTR.theta);
        qreal cp1y = (Y + mTR.d) + mTR.k * mTR.r * std::sin(mTR.theta);
        qreal cp2x = (X + W - mTR.d) - mTR.k * mTR.r * std::sin(mTR.theta);
        qreal cp2y = (Y + mTR.p - mTR.a - mTR.b - mTR.c) - mTR.k * mTR.r * std::cos(mTR.theta);
        path.cubicTo(cp1x, cp1y, cp2x, cp2y, X + W - mTR.d, Y + mTR.p - mTR.a - mTR.b - mTR.c);
        // Segment 3 (Arc -> Straight)
        path.cubicTo(
            X + W, Y + mTR.p - mTR.a - mTR.b,
            X + W, Y + mTR.p - mTR.a,
            X + W, Y + mTR.p
        );
    }

    // 2. Right Edge -> Bottom-Right Corner
    if (mBR.r <= 0.001) {
        path.lineTo(X + W, Y + H);
    } else {
        path.lineTo(X + W, Y + H - mBR.p);
        // Segment 1
        path.cubicTo(
            X + W, Y + H - (mBR.p - mBR.a),
            X + W, Y + H - (mBR.p - mBR.a - mBR.b),
            X + W - mBR.d, Y + H - (mBR.p - mBR.a - mBR.b - mBR.c)
        );
        // Segment 2 (Arc)
        qreal cp1x = (X + W - mBR.d) - mBR.k * mBR.r * std::sin(mBR.theta);
        qreal cp1y = (Y + H - (mBR.p - mBR.a - mBR.b - mBR.c)) + mBR.k * mBR.r * std::cos(mBR.theta);
        qreal cp2x = (X + W - (mBR.p - mBR.a - mBR.b - mBR.c)) + mBR.k * mBR.r * std::cos(mBR.theta);
        qreal cp2y = (Y + H - mBR.d) - mBR.k * mBR.r * std::sin(mBR.theta);
        path.cubicTo(cp1x, cp1y, cp2x, cp2y, X + W - (mBR.p - mBR.a - mBR.b - mBR.c), Y + H - mBR.d);
        // Segment 3
        path.cubicTo(
            X + W - (mBR.p - mBR.a - mBR.b), Y + H,
            X + W - (mBR.p - mBR.a), Y + H,
            X + W - mBR.p, Y + H
        );
    }

    // 3. Bottom Edge -> Bottom-Left Corner
    if (mBL.r <= 0.001) {
        path.lineTo(X, Y + H);
    } else {
        path.lineTo(X + mBL.p, Y + H);
        // Segment 1
        path.cubicTo(
            X + (mBL.p - mBL.a), Y + H,
            X + (mBL.p - mBL.a - mBL.b), Y + H,
            X + (mBL.p - mBL.a - mBL.b - mBL.c), Y + H - mBL.d
        );
        // Segment 2 (Arc)
        qreal cp1x = (X + (mBL.p - mBL.a - mBL.b - mBL.c)) - mBL.k * mBL.r * std::cos(mBL.theta);
        qreal cp1y = (Y + H - mBL.d) - mBL.k * mBL.r * std::sin(mBL.theta);
        qreal cp2x = (X + mBL.d) + mBL.k * mBL.r * std::sin(mBL.theta);
        qreal cp2y = (Y + H - (mBL.p - mBL.a - mBL.b - mBL.c)) + mBL.k * mBL.r * std::cos(mBL.theta);
        path.cubicTo(cp1x, cp1y, cp2x, cp2y, X + mBL.d, Y + H - (mBL.p - mBL.a - mBL.b - mBL.c));
        // Segment 3
        path.cubicTo(
            X, Y + H - (mBL.p - mBL.a - mBL.b),
            X, Y + H - (mBL.p - mBL.a),
            X, Y + H - mBL.p
        );
    }

    // 4. Left Edge -> Top-Left Corner
    if (mTL.r <= 0.001) {
        path.lineTo(X, Y);
    } else {
        path.lineTo(X, Y + mTL.p);
        // Segment 1
        path.cubicTo(
            X, Y + (mTL.p - mTL.a),
            X, Y + (mTL.p - mTL.a - mTL.b),
            X + mTL.d, Y + (mTL.p - mTL.a - mTL.b - mTL.c)
        );
        // Segment 2 (Arc)
        qreal cp1x = (X + mTL.d) + mTL.k * mTL.r * std::sin(mTL.theta);
        qreal cp1y = (Y + (mTL.p - mTL.a - mTL.b - mTL.c)) - mTL.k * mTL.r * std::cos(mTL.theta);
        qreal cp2x = (X + (mTL.p - mTL.a - mTL.b - mTL.c)) - mTL.k * mTL.r * std::cos(mTL.theta);
        qreal cp2y = (Y + mTL.d) + mTL.k * mTL.r * std::sin(mTL.theta);
        path.cubicTo(cp1x, cp1y, cp2x, cp2y, X + (mTL.p - mTL.a - mTL.b - mTL.c), Y + mTL.d);
        // Segment 3
        path.cubicTo(
            X + (mTL.p - mTL.a - mTL.b), Y,
            X + (mTL.p - mTL.a), Y,
            X + mTL.p, Y
        );
    }

    path.closeSubpath();
    return path;
}

void ChaSetSquircle::paint(QPainter *painter)
{
    const qreal W = width();
    const qreal H = height();
    if (W <= 0 || H <= 0)
        return;

    painter->setRenderHint(QPainter::Antialiasing, true);
    painter->setRenderHint(QPainter::SmoothPixmapTransform, true);

    const qreal rTL = (m_topLeftRadius >= 0.0) ? m_topLeftRadius : m_radius;
    const qreal rTR = (m_topRightRadius >= 0.0) ? m_topRightRadius : m_radius;
    const qreal rBR = (m_bottomRightRadius >= 0.0) ? m_bottomRightRadius : m_radius;
    const qreal rBL = (m_bottomLeftRadius >= 0.0) ? m_bottomLeftRadius : m_radius;

    const bool tl = m_roundLeft && m_roundTop && m_roundTopLeft;
    const bool tr = m_roundRight && m_roundTop && m_roundTopRight;
    const bool br = m_roundRight && m_roundBottom && m_roundBottomRight;
    const bool bl = m_roundLeft && m_roundBottom && m_roundBottomLeft;

    const qreal bw = m_pen.width();
    const QColor bc = m_pen.color();
    const bool hasBorder = (bw > 0.0 && bc.alpha() > 0);

    // 1. Fill background
    if (m_color.alpha() > 0) {
        QRectF fillRect(0, 0, W, H);
        QPainterPath fillPath = createSquirclePath(fillRect, rTL, rTR, rBR, rBL, m_cornerSmoothing, tl, tr, br, bl);
        painter->setPen(Qt::NoPen);
        painter->setBrush(m_color);
        painter->drawPath(fillPath);
    }

    // 2. Stroke inner border (box-sizing: border-box)
    if (hasBorder) {
        const qreal inset = bw / 2.0;
        QRectF strokeRect(inset, inset, std::max(0.0, W - bw), std::max(0.0, H - bw));
        const qreal strTL = std::max(0.0, rTL - inset);
        const qreal strTR = std::max(0.0, rTR - inset);
        const qreal strBR = std::max(0.0, rBR - inset);
        const qreal strBL = std::max(0.0, rBL - inset);

        QPainterPath strokePath = createSquirclePath(strokeRect, strTL, strTR, strBR, strBL, m_cornerSmoothing, tl, tr, br, bl);
        QPen pen(bc, bw, Qt::SolidLine, Qt::FlatCap, Qt::MiterJoin);
        painter->setPen(pen);
        painter->setBrush(Qt::NoBrush);
        painter->drawPath(strokePath);
    }
}
