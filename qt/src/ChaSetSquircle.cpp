#include "ChaSetSquircle.h"

#include <QSGNode>
#include <QSGGeometryNode>
#include <QSGVertexColorMaterial>
#include <QSGGeometry>
#include <QtMath>
#include <algorithm>
#include <cmath>
#include <tuple>

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

class ChaSetSquircleNode : public QSGGeometryNode
{
public:
    QSGVertexColorMaterial material;

    ChaSetSquircleNode() {
        material.setFlag(QSGMaterial::Blending, true);
        setMaterial(&material);
        setFlag(OwnsGeometry, true);
    }
};

static QVector<QPointF> computeClockwiseNormals(const QVector<QPointF> &pts)
{
    const int N = pts.size();
    QVector<QPointF> normals(N);
    if (N < 3)
        return normals;

    QVector<QPointF> edgeNormals(N);
    for (int i = 0; i < N; ++i) {
        const int next = (i + 1 == N) ? 0 : (i + 1);
        const qreal dx = pts[next].x() - pts[i].x();
        const qreal dy = pts[next].y() - pts[i].y();
        const qreal len = std::hypot(dx, dy);
        if (len > 1e-6) {
            edgeNormals[i] = QPointF(dy / len, -dx / len);
        } else {
            edgeNormals[i] = QPointF(0, 0);
        }
    }

    for (int i = 0; i < N; ++i) {
        const int prev = (i == 0) ? (N - 1) : (i - 1);
        QPointF n1 = edgeNormals[prev];
        QPointF n2 = edgeNormals[i];
        if (n1.isNull()) n1 = n2;
        if (n2.isNull()) n2 = n1;

        QPointF sum = n1 + n2;
        const qreal sumLen = std::hypot(sum.x(), sum.y());
        if (sumLen > 1e-6) {
            QPointF u = sum / sumLen;
            const qreal dot = u.x() * n2.x() + u.y() * n2.y();
            const qreal miter = 1.0 / std::max(0.5, dot);
            normals[i] = u * std::min(2.0, miter);
        } else if (!n2.isNull()) {
            normals[i] = n2;
        } else {
            normals[i] = QPointF(0, -1);
        }
    }

    return normals;
}

ChaSetSquircle::ChaSetSquircle(QQuickItem *parent)
    : QQuickItem(parent)
{
    setFlag(ItemHasContents, true);
    setAntialiasing(true);

    connect(&m_pen, &ChaSetSquirclePen::changed, this, [this]() {
        update();
    });
}

void ChaSetSquircle::geometryChange(const QRectF &newGeometry, const QRectF &oldGeometry)
{
    QQuickItem::geometryChange(newGeometry, oldGeometry);
    if (newGeometry.size() != oldGeometry.size()) {
        update();
    }
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

static inline QPointF evalCubic(const QPointF &p0, const QPointF &p1, const QPointF &p2, const QPointF &p3, qreal t)
{
    const qreal u = 1.0 - t;
    const qreal tt = t * t;
    const qreal uu = u * u;
    const qreal uuu = uu * u;
    const qreal ttt = tt * t;
    return uuu * p0 + 3.0 * uu * t * p1 + 3.0 * u * tt * p2 + ttt * p3;
}

static inline void sampleCubic(QVector<QPointF> &pts, const QPointF &p0, const QPointF &p1, const QPointF &p2, const QPointF &p3, int steps)
{
    for (int i = 1; i <= steps; ++i) {
        qreal t = static_cast<qreal>(i) / steps;
        pts.append(evalCubic(p0, p1, p2, p3, t));
    }
}

// 半径退化（≤ 0.001）的圆角必须占用与真实圆角完全相同的顶点数，
// 否则内外轮廓顶点数不一致，描边成环时无法逐点配对（会越界访问）。
// 退化的三个贝塞尔段全部塌缩到同一个角点，几何上等价于零半径尖角。
static inline void appendDegenerateCorner(QVector<QPointF> &pts, const QPointF &corner, int stepsPerSegment)
{
    pts.append(corner);
    pts.insert(pts.end(), 3 * stepsPerSegment, corner);
}

QVector<QPointF> ChaSetSquircle::generateSquirclePolygon(
    const QRectF &rect,
    qreal rTL, qreal rTR, qreal rBR, qreal rBL,
    qreal smoothing,
    bool tl, bool tr, bool br, bool bl,
    int stepsPerSegment)
{
    QVector<QPointF> pts;
    const qreal W = rect.width();
    const qreal H = rect.height();
    const qreal X = rect.x();
    const qreal Y = rect.y();

    if (W <= 0.0 || H <= 0.0)
        return pts;

    const qreal shortest_l = std::min(W, H);
    CornerMath mTL = (tl && rTL > 0.001) ? calcCorner(rTL, smoothing, shortest_l) : CornerMath{};
    CornerMath mTR = (tr && rTR > 0.001) ? calcCorner(rTR, smoothing, shortest_l) : CornerMath{};
    CornerMath mBR = (br && rBR > 0.001) ? calcCorner(rBR, smoothing, shortest_l) : CornerMath{};
    CornerMath mBL = (bl && rBL > 0.001) ? calcCorner(rBL, smoothing, shortest_l) : CornerMath{};

    pts.reserve(256);

    // 1. Top Edge -> Top-Right Corner
    if (mTR.r <= 0.001) {
        appendDegenerateCorner(pts, QPointF(X + W, Y), stepsPerSegment);
    } else {
        pts.append(QPointF(X + W - mTR.p, Y));
        // Segment 1
        QPointF p0(X + W - mTR.p, Y);
        QPointF p1(X + W - (mTR.p - mTR.a), Y);
        QPointF p2(X + W - (mTR.p - mTR.a - mTR.b), Y);
        QPointF p3(X + W - (mTR.p - mTR.a - mTR.b - mTR.c), Y + mTR.d);
        sampleCubic(pts, p0, p1, p2, p3, stepsPerSegment);

        // Segment 2 (Arc)
        qreal cp1x = (X + W - (mTR.p - mTR.a - mTR.b - mTR.c)) + mTR.k * mTR.r * std::cos(mTR.theta);
        qreal cp1y = (Y + mTR.d) + mTR.k * mTR.r * std::sin(mTR.theta);
        qreal cp2x = (X + W - mTR.d) - mTR.k * mTR.r * std::sin(mTR.theta);
        qreal cp2y = (Y + mTR.p - mTR.a - mTR.b - mTR.c) - mTR.k * mTR.r * std::cos(mTR.theta);
        QPointF pArcEnd(X + W - mTR.d, Y + mTR.p - mTR.a - mTR.b - mTR.c);
        sampleCubic(pts, p3, QPointF(cp1x, cp1y), QPointF(cp2x, cp2y), pArcEnd, stepsPerSegment);

        // Segment 3
        QPointF p4(X + W, Y + mTR.p - mTR.a - mTR.b);
        QPointF p5(X + W, Y + mTR.p - mTR.a);
        QPointF p6(X + W, Y + mTR.p);
        sampleCubic(pts, pArcEnd, p4, p5, p6, stepsPerSegment);
    }

    // 2. Right Edge -> Bottom-Right Corner
    if (mBR.r <= 0.001) {
        appendDegenerateCorner(pts, QPointF(X + W, Y + H), stepsPerSegment);
    } else {
        pts.append(QPointF(X + W, Y + H - mBR.p));
        // Segment 1
        QPointF p0(X + W, Y + H - mBR.p);
        QPointF p1(X + W, Y + H - (mBR.p - mBR.a));
        QPointF p2(X + W, Y + H - (mBR.p - mBR.a - mBR.b));
        QPointF p3(X + W - mBR.d, Y + H - (mBR.p - mBR.a - mBR.b - mBR.c));
        sampleCubic(pts, p0, p1, p2, p3, stepsPerSegment);

        // Segment 2 (Arc)
        qreal cp1x = (X + W - mBR.d) - mBR.k * mBR.r * std::sin(mBR.theta);
        qreal cp1y = (Y + H - (mBR.p - mBR.a - mBR.b - mBR.c)) + mBR.k * mBR.r * std::cos(mBR.theta);
        qreal cp2x = (X + W - (mBR.p - mBR.a - mBR.b - mBR.c)) + mBR.k * mBR.r * std::cos(mBR.theta);
        qreal cp2y = (Y + H - mBR.d) - mBR.k * mBR.r * std::sin(mBR.theta);
        QPointF pArcEnd(X + W - (mBR.p - mBR.a - mBR.b - mBR.c), Y + H - mBR.d);
        sampleCubic(pts, p3, QPointF(cp1x, cp1y), QPointF(cp2x, cp2y), pArcEnd, stepsPerSegment);

        // Segment 3
        QPointF p4(X + W - (mBR.p - mBR.a - mBR.b), Y + H);
        QPointF p5(X + W - (mBR.p - mBR.a), Y + H);
        QPointF p6(X + W - mBR.p, Y + H);
        sampleCubic(pts, pArcEnd, p4, p5, p6, stepsPerSegment);
    }

    // 3. Bottom Edge -> Bottom-Left Corner
    if (mBL.r <= 0.001) {
        appendDegenerateCorner(pts, QPointF(X, Y + H), stepsPerSegment);
    } else {
        pts.append(QPointF(X + mBL.p, Y + H));
        // Segment 1
        QPointF p0(X + mBL.p, Y + H);
        QPointF p1(X + (mBL.p - mBL.a), Y + H);
        QPointF p2(X + (mBL.p - mBL.a - mBL.b), Y + H);
        QPointF p3(X + (mBL.p - mBL.a - mBL.b - mBL.c), Y + H - mBL.d);
        sampleCubic(pts, p0, p1, p2, p3, stepsPerSegment);

        // Segment 2 (Arc)
        qreal cp1x = (X + (mBL.p - mBL.a - mBL.b - mBL.c)) - mBL.k * mBL.r * std::cos(mBL.theta);
        qreal cp1y = (Y + H - mBL.d) - mBL.k * mBL.r * std::sin(mBL.theta);
        qreal cp2x = (X + mBL.d) + mBL.k * mBL.r * std::sin(mBL.theta);
        qreal cp2y = (Y + H - (mBL.p - mBL.a - mBL.b - mBL.c)) + mBL.k * mBL.r * std::cos(mBL.theta);
        QPointF pArcEnd(X + mBL.d, Y + H - (mBL.p - mBL.a - mBL.b - mBL.c));
        sampleCubic(pts, p3, QPointF(cp1x, cp1y), QPointF(cp2x, cp2y), pArcEnd, stepsPerSegment);

        // Segment 3
        QPointF p4(X, Y + H - (mBL.p - mBL.a - mBL.b));
        QPointF p5(X, Y + H - (mBL.p - mBL.a));
        QPointF p6(X, Y + H - mBL.p);
        sampleCubic(pts, pArcEnd, p4, p5, p6, stepsPerSegment);
    }

    // 4. Left Edge -> Top-Left Corner
    if (mTL.r <= 0.001) {
        appendDegenerateCorner(pts, QPointF(X, Y), stepsPerSegment);
    } else {
        pts.append(QPointF(X, Y + mTL.p));
        // Segment 1
        QPointF p0(X, Y + mTL.p);
        QPointF p1(X, Y + (mTL.p - mTL.a));
        QPointF p2(X, Y + (mTL.p - mTL.a - mTL.b));
        QPointF p3(X + mTL.d, Y + (mTL.p - mTL.a - mTL.b - mTL.c));
        sampleCubic(pts, p0, p1, p2, p3, stepsPerSegment);

        // Segment 2 (Arc)
        qreal cp1x = (X + mTL.d) + mTL.k * mTL.r * std::sin(mTL.theta);
        qreal cp1y = (Y + (mTL.p - mTL.a - mTL.b - mTL.c)) - mTL.k * mTL.r * std::cos(mTL.theta);
        qreal cp2x = (X + (mTL.p - mTL.a - mTL.b - mTL.c)) - mTL.k * mTL.r * std::cos(mTL.theta);
        qreal cp2y = (Y + mTL.d) + mTL.k * mTL.r * std::sin(mTL.theta);
        QPointF pArcEnd(X + (mTL.p - mTL.a - mTL.b - mTL.c), Y + mTL.d);
        sampleCubic(pts, p3, QPointF(cp1x, cp1y), QPointF(cp2x, cp2y), pArcEnd, stepsPerSegment);

        // Segment 3
        QPointF p4(X + (mTL.p - mTL.a - mTL.b), Y);
        QPointF p5(X + (mTL.p - mTL.a), Y);
        QPointF p6(X + mTL.p, Y);
        sampleCubic(pts, pArcEnd, p4, p5, p6, stepsPerSegment);
    }

    return pts;
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
        path.cubicTo(
            X + W - (mTR.p - mTR.a), Y,
            X + W - (mTR.p - mTR.a - mTR.b), Y,
            X + W - (mTR.p - mTR.a - mTR.b - mTR.c), Y + mTR.d
        );
        qreal cp1x = (X + W - (mTR.p - mTR.a - mTR.b - mTR.c)) + mTR.k * mTR.r * std::cos(mTR.theta);
        qreal cp1y = (Y + mTR.d) + mTR.k * mTR.r * std::sin(mTR.theta);
        qreal cp2x = (X + W - mTR.d) - mTR.k * mTR.r * std::sin(mTR.theta);
        qreal cp2y = (Y + mTR.p - mTR.a - mTR.b - mTR.c) - mTR.k * mTR.r * std::cos(mTR.theta);
        path.cubicTo(cp1x, cp1y, cp2x, cp2y, X + W - mTR.d, Y + mTR.p - mTR.a - mTR.b - mTR.c);
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
        path.cubicTo(
            X + W, Y + H - (mBR.p - mBR.a),
            X + W, Y + H - (mBR.p - mBR.a - mBR.b),
            X + W - mBR.d, Y + H - (mBR.p - mBR.a - mBR.b - mBR.c)
        );
        qreal cp1x = (X + W - mBR.d) - mBR.k * mBR.r * std::sin(mBR.theta);
        qreal cp1y = (Y + H - (mBR.p - mBR.a - mBR.b - mBR.c)) + mBR.k * mBR.r * std::cos(mBR.theta);
        qreal cp2x = (X + W - (mBR.p - mBR.a - mBR.b - mBR.c)) + mBR.k * mBR.r * std::cos(mBR.theta);
        qreal cp2y = (Y + H - mBR.d) - mBR.k * mBR.r * std::sin(mBR.theta);
        path.cubicTo(cp1x, cp1y, cp2x, cp2y, X + W - (mBR.p - mBR.a - mBR.b - mBR.c), Y + H - mBR.d);
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
        path.cubicTo(
            X + (mBL.p - mBL.a), Y + H,
            X + (mBL.p - mBL.a - mBL.b), Y + H,
            X + (mBL.p - mBL.a - mBL.b - mBL.c), Y + H - mBL.d
        );
        qreal cp1x = (X + (mBL.p - mBL.a - mBL.b - mBL.c)) - mBL.k * mBL.r * std::cos(mBL.theta);
        qreal cp1y = (Y + H - mBL.d) - mBL.k * mBL.r * std::sin(mBL.theta);
        qreal cp2x = (X + mBL.d) + mBL.k * mBL.r * std::sin(mBL.theta);
        qreal cp2y = (Y + H - (mBL.p - mBL.a - mBL.b - mBL.c)) + mBL.k * mBL.r * std::cos(mBL.theta);
        path.cubicTo(cp1x, cp1y, cp2x, cp2y, X + mBL.d, Y + H - (mBL.p - mBL.a - mBL.b - mBL.c));
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
        path.cubicTo(
            X, Y + (mTL.p - mTL.a),
            X, Y + (mTL.p - mTL.a - mTL.b),
            X + mTL.d, Y + (mTL.p - mTL.a - mTL.b - mTL.c)
        );
        qreal cp1x = (X + mTL.d) + mTL.k * mTL.r * std::sin(mTL.theta);
        qreal cp1y = (Y + (mTL.p - mTL.a - mTL.b - mTL.c)) - mTL.k * mTL.r * std::cos(mTL.theta);
        qreal cp2x = (X + (mTL.p - mTL.a - mTL.b - mTL.c)) - mTL.k * mTL.r * std::cos(mTL.theta);
        qreal cp2y = (Y + mTL.d) + mTL.k * mTL.r * std::sin(mTL.theta);
        path.cubicTo(cp1x, cp1y, cp2x, cp2y, X + (mTL.p - mTL.a - mTL.b - mTL.c), Y + mTL.d);
        path.cubicTo(
            X + (mTL.p - mTL.a - mTL.b), Y,
            X + (mTL.p - mTL.a), Y,
            X + mTL.p, Y
        );
    }

    path.closeSubpath();
    return path;
}

QSGNode *ChaSetSquircle::updatePaintNode(QSGNode *oldNode, UpdatePaintNodeData *)
{
    const qreal W = width();
    const qreal H = height();
    if (W <= 0.0 || H <= 0.0) {
        delete oldNode;
        return nullptr;
    }

    const qreal bw = m_pen.width();
    const QColor bc = m_pen.color();
    const bool hasBorder = (bw > 0.0 && bc.alpha() > 0);
    const bool hasFill = (m_color.alpha() > 0);

    if (!hasFill && !hasBorder) {
        delete oldNode;
        return nullptr;
    }

    ChaSetSquircleNode *node = static_cast<ChaSetSquircleNode *>(oldNode);
    if (!node) {
        node = new ChaSetSquircleNode();
    }

    const qreal rTL = (m_topLeftRadius >= 0.0) ? m_topLeftRadius : m_radius;
    const qreal rTR = (m_topRightRadius >= 0.0) ? m_topRightRadius : m_radius;
    const qreal rBR = (m_bottomRightRadius >= 0.0) ? m_bottomRightRadius : m_radius;
    const qreal rBL = (m_bottomLeftRadius >= 0.0) ? m_bottomLeftRadius : m_radius;

    const bool tl = m_roundLeft && m_roundTop && m_roundTopLeft;
    const bool tr = m_roundRight && m_roundTop && m_roundTopRight;
    const bool br = m_roundRight && m_roundBottom && m_roundBottomRight;
    const bool bl = m_roundLeft && m_roundBottom && m_roundBottomLeft;

    const int steps = 16;
    QRectF fillRect(0, 0, W, H);
    QVector<QPointF> outerPoints = generateSquirclePolygon(fillRect, rTL, rTR, rBR, rBL, m_cornerSmoothing, tl, tr, br, bl, steps);
    const int N = outerPoints.size();
    if (N < 3) {
        delete node;
        return nullptr;
    }

    QVector<QPointF> outerNormals = computeClockwiseNormals(outerPoints);

    QVector<QPointF> innerPoints;
    QVector<QPointF> innerNormals;
    bool actualBorder = false;
    if (hasBorder) {
        const qreal inset = bw;
        if (2.0 * inset < W && 2.0 * inset < H) {
            const qreal innerW = W - 2.0 * inset;
            const qreal innerH = H - 2.0 * inset;
            QRectF strokeRect(inset, inset, innerW, innerH);
            const qreal strTL = std::max(0.0, rTL - inset);
            const qreal strTR = std::max(0.0, rTR - inset);
            const qreal strBR = std::max(0.0, rBR - inset);
            const qreal strBL = std::max(0.0, rBL - inset);

            innerPoints = generateSquirclePolygon(strokeRect, strTL, strTR, strBR, strBL, m_cornerSmoothing, tl, tr, br, bl, steps);
            if (innerPoints.size() == N) {
                innerNormals = computeClockwiseNormals(innerPoints);
                actualBorder = true;
            }
        }
    }

    const bool isAA = antialiasing();
    const qreal f = isAA ? 0.5 : 0.0;

    // 内环不可用时统一按实心绘制（几何上等价：描边环已铺满整个外形）。
    // 触发条件：线宽 ≥ 半宽高（内环整体塌缩），或内外轮廓顶点数不配对。
    // 纯描边退化时取描边色，绝不能带着空的内轮廓去逐点成环。
    const bool solid = !actualBorder;
    const QColor solidColor = hasFill ? m_color : bc;

    int numVerts = 0;
    int numIndices = 0;

    if (solid) {
        numVerts = (isAA ? (2 * N + 1) : (N + 1));
        numIndices = (isAA ? (9 * N) : (3 * N));
    } else if (hasFill) {
        numVerts = (isAA ? (4 * N + 1) : (3 * N + 1));
        numIndices = (isAA ? (15 * N) : (9 * N));
    } else {
        numVerts = (isAA ? (4 * N) : (2 * N));
        numIndices = (isAA ? (18 * N) : (6 * N));
    }

    QSGGeometry *geom = node->geometry();
    if (!geom || geom->vertexCount() != numVerts || geom->indexCount() != numIndices) {
        geom = new QSGGeometry(QSGGeometry::defaultAttributes_ColoredPoint2D(), numVerts, numIndices);
        geom->setDrawingMode(QSGGeometry::DrawTriangles);
        node->setGeometry(geom);
    }

    QSGGeometry::ColoredPoint2D *v = geom->vertexDataAsColoredPoint2D();
    quint16 *indices = geom->indexDataAsUShort();

    int vertOffset = 0;
    int idxOffset = 0;

    auto makePremul = [](const QColor &c, float alphaMult = 1.0f) -> std::tuple<uchar, uchar, uchar, uchar> {
        const float a = std::clamp(static_cast<float>(c.alphaF()) * alphaMult, 0.0f, 1.0f);
        const uchar r = static_cast<uchar>(std::round(static_cast<float>(c.redF()) * a * 255.0f));
        const uchar g = static_cast<uchar>(std::round(static_cast<float>(c.greenF()) * a * 255.0f));
        const uchar b = static_cast<uchar>(std::round(static_cast<float>(c.blueF()) * a * 255.0f));
        const uchar na = static_cast<uchar>(std::round(a * 255.0f));
        return {r, g, b, na};
    };

    auto addQuad = [&](quint16 a1, quint16 b1, quint16 a2, quint16 b2) {
        indices[idxOffset++] = a1;
        indices[idxOffset++] = b1;
        indices[idxOffset++] = a2;

        indices[idxOffset++] = a2;
        indices[idxOffset++] = b1;
        indices[idxOffset++] = b2;
    };

    if (solid) {
        const auto [fr, fg, fb, fa] = makePremul(solidColor, 1.0f);
        const auto [zr, zg, zb, za] = makePremul(solidColor, 0.0f);

        const QPointF center(W / 2.0, H / 2.0);
        v[vertOffset + 0].set(static_cast<float>(center.x()), static_cast<float>(center.y()), fr, fg, fb, fa);

        const int coreBase = vertOffset + 1;
        for (int i = 0; i < N; ++i) {
            const QPointF pt = outerPoints[i] - f * outerNormals[i];
            v[coreBase + i].set(static_cast<float>(pt.x()), static_cast<float>(pt.y()), fr, fg, fb, fa);
        }

        for (int i = 0; i < N; ++i) {
            const quint16 c1 = static_cast<quint16>(coreBase + i);
            const quint16 c2 = static_cast<quint16>(coreBase + ((i + 1 == N) ? 0 : (i + 1)));
            indices[idxOffset++] = static_cast<quint16>(vertOffset + 0);
            indices[idxOffset++] = c1;
            indices[idxOffset++] = c2;
        }

        if (isAA) {
            const int fringeBase = coreBase + N;
            for (int i = 0; i < N; ++i) {
                const QPointF pt = outerPoints[i] + f * outerNormals[i];
                v[fringeBase + i].set(static_cast<float>(pt.x()), static_cast<float>(pt.y()), zr, zg, zb, za);
            }

            for (int i = 0; i < N; ++i) {
                const quint16 c1 = static_cast<quint16>(coreBase + i);
                const quint16 c2 = static_cast<quint16>(coreBase + ((i + 1 == N) ? 0 : (i + 1)));
                const quint16 o1 = static_cast<quint16>(fringeBase + i);
                const quint16 o2 = static_cast<quint16>(fringeBase + ((i + 1 == N) ? 0 : (i + 1)));
                addQuad(c1, o1, c2, o2);
            }
        }
    } else if (hasFill) {
        const auto [fr, fg, fb, fa] = makePremul(m_color, 1.0f);
        const auto [br, bg, bb, ba] = makePremul(bc, 1.0f);
        const auto [zr, zg, zb, za] = makePremul(bc, 0.0f);

        // 1. Fill center fan
        const QPointF center(W / 2.0, H / 2.0);
        v[vertOffset + 0].set(static_cast<float>(center.x()), static_cast<float>(center.y()), fr, fg, fb, fa);

        const int fillBase = vertOffset + 1;
        for (int i = 0; i < N; ++i) {
            v[fillBase + i].set(static_cast<float>(innerPoints[i].x()), static_cast<float>(innerPoints[i].y()), fr, fg, fb, fa);
        }

        for (int i = 0; i < N; ++i) {
            const quint16 c1 = static_cast<quint16>(fillBase + i);
            const quint16 c2 = static_cast<quint16>(fillBase + ((i + 1 == N) ? 0 : (i + 1)));
            indices[idxOffset++] = static_cast<quint16>(vertOffset + 0);
            indices[idxOffset++] = c1;
            indices[idxOffset++] = c2;
        }

        // 2. Border body
        const int borderInBase = fillBase + N;
        const int borderOutBase = borderInBase + N;
        for (int i = 0; i < N; ++i) {
            v[borderInBase + i].set(static_cast<float>(innerPoints[i].x()), static_cast<float>(innerPoints[i].y()), br, bg, bb, ba);
            const QPointF pt = outerPoints[i] - f * outerNormals[i];
            v[borderOutBase + i].set(static_cast<float>(pt.x()), static_cast<float>(pt.y()), br, bg, bb, ba);
        }

        for (int i = 0; i < N; ++i) {
            const quint16 in1 = static_cast<quint16>(borderInBase + i);
            const quint16 in2 = static_cast<quint16>(borderInBase + ((i + 1 == N) ? 0 : (i + 1)));
            const quint16 out1 = static_cast<quint16>(borderOutBase + i);
            const quint16 out2 = static_cast<quint16>(borderOutBase + ((i + 1 == N) ? 0 : (i + 1)));
            addQuad(in1, out1, in2, out2);
        }

        // 3. Outer fringe (AA)
        if (isAA) {
            const int fringeBase = borderOutBase + N;
            for (int i = 0; i < N; ++i) {
                const QPointF pt = outerPoints[i] + f * outerNormals[i];
                v[fringeBase + i].set(static_cast<float>(pt.x()), static_cast<float>(pt.y()), zr, zg, zb, za);
            }

            for (int i = 0; i < N; ++i) {
                const quint16 out1 = static_cast<quint16>(borderOutBase + i);
                const quint16 out2 = static_cast<quint16>(borderOutBase + ((i + 1 == N) ? 0 : (i + 1)));
                const quint16 fr1 = static_cast<quint16>(fringeBase + i);
                const quint16 fr2 = static_cast<quint16>(fringeBase + ((i + 1 == N) ? 0 : (i + 1)));
                addQuad(out1, fr1, out2, fr2);
            }
        }
    } else {
        // Outline stroke only
        const auto [br, bg, bb, ba] = makePremul(bc, 1.0f);
        const auto [zr, zg, zb, za] = makePremul(bc, 0.0f);

        if (isAA) {
            const int outFringeBase = vertOffset;
            const int outCoreBase = outFringeBase + N;
            const int inCoreBase = outCoreBase + N;
            const int inFringeBase = inCoreBase + N;

            for (int i = 0; i < N; ++i) {
                const QPointF pOutFr = outerPoints[i] + f * outerNormals[i];
                const QPointF pOutCo = outerPoints[i] - f * outerNormals[i];
                const QPointF pInCo = innerPoints[i] + f * innerNormals[i];
                const QPointF pInFr = innerPoints[i] - f * innerNormals[i];

                v[outFringeBase + i].set(static_cast<float>(pOutFr.x()), static_cast<float>(pOutFr.y()), zr, zg, zb, za);
                v[outCoreBase + i].set(static_cast<float>(pOutCo.x()), static_cast<float>(pOutCo.y()), br, bg, bb, ba);
                v[inCoreBase + i].set(static_cast<float>(pInCo.x()), static_cast<float>(pInCo.y()), br, bg, bb, ba);
                v[inFringeBase + i].set(static_cast<float>(pInFr.x()), static_cast<float>(pInFr.y()), zr, zg, zb, za);
            }

            for (int i = 0; i < N; ++i) {
                const quint16 oFr1 = static_cast<quint16>(outFringeBase + i);
                const quint16 oFr2 = static_cast<quint16>(outFringeBase + ((i + 1 == N) ? 0 : (i + 1)));
                const quint16 oCo1 = static_cast<quint16>(outCoreBase + i);
                const quint16 oCo2 = static_cast<quint16>(outCoreBase + ((i + 1 == N) ? 0 : (i + 1)));

                const quint16 iCo1 = static_cast<quint16>(inCoreBase + i);
                const quint16 iCo2 = static_cast<quint16>(inCoreBase + ((i + 1 == N) ? 0 : (i + 1)));
                const quint16 iFr1 = static_cast<quint16>(inFringeBase + i);
                const quint16 iFr2 = static_cast<quint16>(inFringeBase + ((i + 1 == N) ? 0 : (i + 1)));

                // Outer fringe
                addQuad(oCo1, oFr1, oCo2, oFr2);
                // Border body
                addQuad(iCo1, oCo1, iCo2, oCo2);
                // Inner fringe
                addQuad(iFr1, iCo1, iFr2, iCo2);
            }
        } else {
            const int outCoreBase = vertOffset;
            const int inCoreBase = outCoreBase + N;

            for (int i = 0; i < N; ++i) {
                v[outCoreBase + i].set(static_cast<float>(outerPoints[i].x()), static_cast<float>(outerPoints[i].y()), br, bg, bb, ba);
                v[inCoreBase + i].set(static_cast<float>(innerPoints[i].x()), static_cast<float>(innerPoints[i].y()), br, bg, bb, ba);
            }

            for (int i = 0; i < N; ++i) {
                const quint16 out1 = static_cast<quint16>(outCoreBase + i);
                const quint16 out2 = static_cast<quint16>(outCoreBase + ((i + 1 == N) ? 0 : (i + 1)));
                const quint16 in1 = static_cast<quint16>(inCoreBase + i);
                const quint16 in2 = static_cast<quint16>(inCoreBase + ((i + 1 == N) ? 0 : (i + 1)));
                addQuad(in1, out1, in2, out2);
            }
        }
    }

    geom->markVertexDataDirty();
    geom->markIndexDataDirty();
    node->markDirty(QSGNode::DirtyGeometry);

    return node;
}
